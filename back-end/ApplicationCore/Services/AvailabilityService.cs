using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly IMentorDayAvailableRepository _dayRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISessionBookingRepository _sessionBookingRepository;
    private readonly IBaseRepository<MentorTimeAvailable> _timeSlotRepository;

    public AvailabilityService(
        IMentorDayAvailableRepository dayRepo,
        IUnitOfWork unitOfWork,
        ISessionBookingRepository sessionBookingRepository,
        IBaseRepository<MentorTimeAvailable> timeSlotRepository
    )
    {
        _dayRepo = dayRepo;
        _unitOfWork = unitOfWork;
        _sessionBookingRepository = sessionBookingRepository;
        _timeSlotRepository = timeSlotRepository;
    }

    public async Task<OperationResult<WeekAvailabilityResponseDto>> GetWeekAvailabilityAsync(
        Guid mentorId,
        DateOnly weekStartDate
    )
    {
        var weekEnd = weekStartDate.AddDays(6);
        var days = await _dayRepo.GetByMentorAndDateRangeAsync(
            mentorId,
            weekStartDate,
            weekEnd,
            includeSlots: true
        );

        var weekDto = new WeekAvailabilityResponseDto
        {
            WeekStartDate = weekStartDate.ToString(DatetimeFormat.dayFormat),
            WeekEndDate = weekEnd.ToString(DatetimeFormat.dayFormat),
            Days = days.Select(MapToDayDto).ToList(),
        };

        // Ensure all 7 days are present
        for (int i = 0; i < 7; i++)
        {
            var currentDate = weekStartDate.AddDays(i);
            var formattedDate = currentDate.ToString(DatetimeFormat.dayFormat);
            if (!weekDto.Days.Any(d => d.Date == formattedDate))
            {
                weekDto.Days.Add(
                    new DayAvailabilityDto
                    {
                        Date = formattedDate,
                        DayName = currentDate.DayOfWeek.ToString(),
                        TimeBlocks = new List<TimeBlockDto>(),
                    }
                );
            }
        }

        weekDto.Days = weekDto
            .Days.OrderBy(d =>
                DateOnly.Parse(d.Date, System.Globalization.CultureInfo.InvariantCulture)
            )
            .ToList();

        return OperationResult<WeekAvailabilityResponseDto>.Ok(weekDto);
    }

    public async Task<OperationResult<WeekAvailabilityResponseDto>> SaveWeekAvailabilityAsync(
        SaveWeekAvailabilityRequestDto requestDto
    )
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            foreach (var dayDto in requestDto.Days)
            {
                await UpdateOrCreateMentorDayAvailableAsync(requestDto.MentorId, dayDto);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return await GetWeekAvailabilityAsync(
                requestDto.MentorId,
                DateOnly.Parse(
                    requestDto.WeekStartDate,
                    System.Globalization.CultureInfo.InvariantCulture
                )
            );
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync();
            return OperationResult<WeekAvailabilityResponseDto>.Fail(
                $"Failed to save availability: {ex.Message}"
            );
        }
    }

    private async Task UpdateOrCreateMentorDayAvailableAsync(
        Guid mentorId,
        SaveDayAvailabilityRequestDto dayDto
    )
    {
        var date = DateOnly.Parse(dayDto.Date, System.Globalization.CultureInfo.InvariantCulture);
        var existingDay = await _dayRepo.GetByMentorAndDateAsync(
            mentorId,
            date,
            includeSlots: true
        );

        if (existingDay == null)
        {
            existingDay = new MentorDayAvailable
            {
                Id = Guid.NewGuid(),
                MentorId = mentorId,
                Day = date,
            };
            await _dayRepo.AddAsync(existingDay);
        }

        // Update work hours
        if (!string.IsNullOrWhiteSpace(dayDto.WorkStartTime))
        {
            existingDay.StartWorkTime = TimeOnly.Parse(
                dayDto.WorkStartTime,
                System.Globalization.CultureInfo.InvariantCulture
            );
        }

        if (!string.IsNullOrWhiteSpace(dayDto.WorkEndTime))
        {
            existingDay.EndWorkTime = TimeOnly.Parse(
                dayDto.WorkEndTime,
                System.Globalization.CultureInfo.InvariantCulture
            );
        }

        if (dayDto.SessionDurationMinutes.HasValue)
        {
            existingDay.SessionDuration = TimeOnly.FromTimeSpan(
                TimeSpan.FromMinutes(dayDto.SessionDurationMinutes.Value)
            );
        }

        if (dayDto.BufferMinutes.HasValue)
        {
            existingDay.BufferTime = TimeOnly.FromTimeSpan(
                TimeSpan.FromMinutes(dayDto.BufferMinutes.Value)
            );
        }

        // Clear and re-add time blocks
        existingDay.MentorTimeAvailables.Clear();
        foreach (var blockDto in dayDto.TimeBlocks)
        {
            existingDay.MentorTimeAvailables.Add(
                new MentorTimeAvailable
                {
                    Id = blockDto.Id ?? Guid.NewGuid(),
                    Start = TimeOnly.Parse(
                        blockDto.StartTime,
                        System.Globalization.CultureInfo.InvariantCulture
                    ),
                    End = TimeOnly.Parse(
                        blockDto.EndTime,
                        System.Globalization.CultureInfo.InvariantCulture
                    ),
                    DayId = existingDay.Id,
                    StatusId = blockDto.IsSelected ? 1 : 3,
                }
            );
        }

        _dayRepo.Update(existingDay);
    }

    public async Task<
        OperationResult<ScheduleConfigurationResponseDto>
    > UpdateScheduleConfigurationAsync(
        Guid mentorId,
        UpdateScheduleConfigurationRequestDto requestDto
    )
    {
        var validationErrors = new List<string>();

        if (!TimeOnly.TryParse(requestDto.WorkDayStartTime, out var workDayStartTime))
        {
            validationErrors.Add(
                string.IsNullOrWhiteSpace(requestDto.WorkDayStartTime)
                    ? ValidationMessages.WorkDayStartTimeRequired
                    : "Invalid format for WorkDayStartTime. Use HH:mm format."
            );
        }

        if (!TimeOnly.TryParse(requestDto.WorkDayEndTime, out var workDayEndTime))
        {
            validationErrors.Add(
                string.IsNullOrWhiteSpace(requestDto.WorkDayEndTime)
                    ? ValidationMessages.WorkDayEndTimeRequired
                    : "Invalid format for WorkDayEndTime. Use HH:mm format."
            );
        }

        if (requestDto.SessionDurationInMinutes <= 0)
        {
            validationErrors.Add(ValidationMessages.SessionDurationRequired);
        }

        if (requestDto.BufferTimeInMinutes < 0)
        {
            validationErrors.Add(ValidationMessages.BufferTimeRequired);
        }

        if (
            workDayStartTime != default
            && workDayEndTime != default
            && workDayEndTime <= workDayStartTime
        )
        {
            validationErrors.Add(ValidationMessages.EndTimeAfterStartTime);
        }

        if (validationErrors.Any())
        {
            return OperationResult<ScheduleConfigurationResponseDto>.BadRequest(
                string.Join(" ", validationErrors)
            );
        }

        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var hasFutureBookings = await _sessionBookingRepository.AnyAsync(sb =>
                sb.MentorTimeAvailable.MentorDayAvailable.MentorId == mentorId
                && sb.MentorTimeAvailable.MentorDayAvailable.Day >= today
                && (sb.StatusId == 1 || sb.StatusId == 2)
            );

            if (hasFutureBookings)
            {
                return OperationResult<ScheduleConfigurationResponseDto>.Conflict(
                    ValidationMessages.CONFLICT_EXISTING_BOOKED_SESSIONS
                );
            }

            var sessionDuration = TimeOnly.FromTimeSpan(
                TimeSpan.FromMinutes(requestDto.SessionDurationInMinutes)
            );
            var bufferTime = TimeOnly.FromTimeSpan(
                TimeSpan.FromMinutes(requestDto.BufferTimeInMinutes)
            );
            var effectiveEndDate = today.AddYears(1);

            var updatedDays = await _dayRepo.UpdateScheduleSettingsAndGetUpdatedDaysAsync(
                mentorId,
                today,
                effectiveEndDate,
                workDayStartTime,
                workDayEndTime,
                sessionDuration,
                bufferTime
            );

            foreach (var day in updatedDays)
            {
                _timeSlotRepository.DeleteRange(day.MentorTimeAvailables);
                day.MentorTimeAvailables.Clear();

                var currentTime = day.StartWorkTime;
                while (currentTime < day.EndWorkTime)
                {
                    var slotEnd = currentTime.Add(day.SessionDuration.ToTimeSpan());
                    if (slotEnd > day.EndWorkTime)
                        break;

                    day.MentorTimeAvailables.Add(
                        new MentorTimeAvailable
                        {
                            Id = Guid.NewGuid(),
                            DayId = day.Id,
                            Start = currentTime,
                            End = slotEnd,
                            StatusId = 1,
                        }
                    );

                    currentTime = slotEnd.Add(day.BufferTime.ToTimeSpan());
                }

                _dayRepo.Update(day);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return OperationResult<ScheduleConfigurationResponseDto>.Ok(
                new ScheduleConfigurationResponseDto
                {
                    MentorId = mentorId,
                    WorkDayStartTime = workDayStartTime.ToString("HH:mm"),
                    WorkDayEndTime = workDayEndTime.ToString("HH:mm"),
                    SessionDurationInMinutes = requestDto.SessionDurationInMinutes,
                    BufferTimeInMinutes = requestDto.BufferTimeInMinutes,
                    LastUpdatedAt = DateTime.UtcNow,
                }
            );
        }
        catch (DbUpdateException ex)
        {
            await _unitOfWork.RollbackAsync();
            return OperationResult<ScheduleConfigurationResponseDto>.Fail(
                $"Database error while updating schedule: {ex.Message}",
                HttpStatusCode.InternalServerError
            );
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync();
            return OperationResult<ScheduleConfigurationResponseDto>.Fail(
                $"An error occurred while updating schedule configuration: {ex.Message}",
                HttpStatusCode.InternalServerError
            );
        }
    }

    private static DayAvailabilityDto MapToDayDto(MentorDayAvailable entity)
    {
        return new DayAvailabilityDto
        {
            Date = entity.Day.ToString("yyyy-MM-dd"),
            DayName = entity.Day.DayOfWeek.ToString(),
            WorkStartTime = entity.StartWorkTime.ToString("HH:mm"),
            WorkEndTime = entity.EndWorkTime.ToString("HH:mm"),
            SessionDurationMinutes =
                entity.SessionDuration.Hour * 60 + entity.SessionDuration.Minute,
            BufferMinutes = entity.BufferTime.Hour * 60 + entity.BufferTime.Minute,
            TimeBlocks = entity
                .MentorTimeAvailables.Select(tb => new TimeBlockDto
                {
                    Id = tb.Id,
                    StartTime = tb.Start.ToString("HH:mm"),
                    EndTime = tb.End.ToString("HH:mm"),
                    IsSelected = tb.StatusId == 1,
                    IsBooked = tb.SessionBookings.Any(),
                })
                .OrderBy(tb => tb.StartTime)
                .ToList(),
        };
    }
}
