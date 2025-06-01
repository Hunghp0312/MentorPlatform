using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

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
        IBaseRepository<MentorTimeAvailable> timeSlotRepository)
    {
        _dayRepo = dayRepo;
        _unitOfWork = unitOfWork;
        _sessionBookingRepository = sessionBookingRepository;
        _timeSlotRepository = timeSlotRepository;
    }

    public async Task<OperationResult<WeekAvailabilityResponseDto>> GetWeekAvailabilityAsync(Guid mentorId, DateOnly weekStartDate)
    {
        var weekEnd = weekStartDate.AddDays(6);
        var days = await _dayRepo.GetByMentorAndDateRangeAsync(mentorId, weekStartDate, weekEnd, includeSlots: true);

        var weekDto = new WeekAvailabilityResponseDto
        {
            WeekStartDate = weekStartDate.ToString("yyyy-MM-dd"),
            WeekEndDate = weekEnd.ToString("yyyy-MM-dd"),
            Days = days.Select(MapToDayDto).ToList()
        };

        // ensure all 7 days present
        for (int i = 0; i < 7; i++)
        {
            var currentDate = weekStartDate.AddDays(i);
            var existing = weekDto.Days.FirstOrDefault(d => d.Date == currentDate.ToString("yyyy-MM-dd"));
            if (existing == null)
            {
                weekDto.Days.Add(new DayAvailabilityDto
                {
                    Date = currentDate.ToString("yyyy-MM-dd"),
                    DayName = currentDate.DayOfWeek.ToString(),
                    TimeBlocks = new List<TimeBlockDto>()
                });
            }
        }

        weekDto.Days = weekDto.Days.OrderBy(d => DateOnly.Parse(d.Date)).ToList();

        return OperationResult<WeekAvailabilityResponseDto>.Ok(weekDto);
    }

    public async Task<OperationResult<WeekAvailabilityResponseDto>> SaveWeekAvailabilityAsync(SaveWeekAvailabilityRequestDto requestDto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            var mentorId = requestDto.MentorId;
            foreach (var dayDto in requestDto.Days)
            {
                var date = DateOnly.Parse(dayDto.Date);
                var existingDay = await _dayRepo.GetByMentorAndDateAsync(mentorId, date, includeSlots: true);
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

                // update work hours
                if (!string.IsNullOrWhiteSpace(dayDto.WorkStartTime))
                {
                    existingDay.StartWorkTime = TimeOnly.Parse(dayDto.WorkStartTime);
                }
                if (!string.IsNullOrWhiteSpace(dayDto.WorkEndTime))
                {
                    existingDay.EndWorkTime = TimeOnly.Parse(dayDto.WorkEndTime);
                }
                if (dayDto.SessionDurationMinutes.HasValue)
                {
                    existingDay.SessionDuration = TimeOnly.FromTimeSpan(TimeSpan.FromMinutes(dayDto.SessionDurationMinutes.Value));
                }
                if (dayDto.BufferMinutes.HasValue)
                {
                    existingDay.BufferTime = TimeOnly.FromTimeSpan(TimeSpan.FromMinutes(dayDto.BufferMinutes.Value));
                }

                // handle time blocks
                // simplistic approach: clear and recreate (optimize later)
                existingDay.MentorTimeAvailables.Clear();
                foreach (var blockDto in dayDto.TimeBlocks)
                {
                    var block = new MentorTimeAvailable
                    {
                        Id = blockDto.Id ?? Guid.NewGuid(),
                        Start = TimeOnly.Parse(blockDto.StartTime),
                        End = TimeOnly.Parse(blockDto.EndTime),
                        DayId = existingDay.Id,
                        StatusId = blockDto.IsSelected ? 1 : 3 // 1: available, 3: unavailable
                    };
                    existingDay.MentorTimeAvailables.Add(block);
                }

                _dayRepo.Update(existingDay);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return await GetWeekAvailabilityAsync(requestDto.MentorId, DateOnly.Parse(requestDto.WeekStartDate));
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync();
            return OperationResult<WeekAvailabilityResponseDto>.Fail($"Failed to save availability: {ex.Message}");
        }
    }

    public async Task<OperationResult<ScheduleConfigurationResponseDto>> UpdateScheduleConfigurationAsync(Guid mentorId, UpdateScheduleConfigurationRequestDto requestDto)
    {
        var validationErrors = new List<string>();

        TimeOnly workDayStartTime = default;
        TimeOnly workDayEndTime = default;

        if (string.IsNullOrWhiteSpace(requestDto.WorkDayStartTime))
        {
            validationErrors.Add(ValidationMessages.WorkDayStartTimeRequired);
        }
        else if (!TimeOnly.TryParse(requestDto.WorkDayStartTime, out workDayStartTime))
        {
            validationErrors.Add("Invalid format for WorkDayStartTime. Use HH:mm format."); // Consider adding to ValidationMessages
        }

        if (string.IsNullOrWhiteSpace(requestDto.WorkDayEndTime))
        {
            validationErrors.Add(ValidationMessages.WorkDayEndTimeRequired);
        }
        else if (!TimeOnly.TryParse(requestDto.WorkDayEndTime, out workDayEndTime))
        {
            validationErrors.Add("Invalid format for WorkDayEndTime. Use HH:mm format."); // Consider adding to ValidationMessages
        }

        if (requestDto.SessionDurationInMinutes <= 0)
        {
            validationErrors.Add(ValidationMessages.SessionDurationRequired); // Or more specific: "Session duration must be a positive number of minutes."
        }

        if (requestDto.BufferTimeInMinutes < 0)
        {
            validationErrors.Add(ValidationMessages.BufferTimeRequired); // Consider adding to ValidationMessages
        }

        // Perform this check only if both times were parsed successfully
        if (workDayStartTime != default && workDayEndTime != default && workDayEndTime <= workDayStartTime)
        {
            validationErrors.Add(ValidationMessages.EndTimeAfterStartTime);
        }

        if (validationErrors.Any())
        {
            return OperationResult<ScheduleConfigurationResponseDto>.BadRequest(string.Join(" ", validationErrors));
        }

        var sessionDuration = TimeOnly.FromTimeSpan(TimeSpan.FromMinutes(requestDto.SessionDurationInMinutes));
        var bufferTime = TimeOnly.FromTimeSpan(TimeSpan.FromMinutes(requestDto.BufferTimeInMinutes));

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var hasFutureBookings = await _sessionBookingRepository.AnyAsync(sb =>
            sb.MentorTimeAvailable.MentorDayAvailable.MentorId == mentorId &&
            sb.MentorTimeAvailable.MentorDayAvailable.Day >= today &&
            (sb.StatusId == 1 || sb.StatusId == 2)); // 1 for Confirmed, 2 for Pending

        if (hasFutureBookings)
        {
            return OperationResult<ScheduleConfigurationResponseDto>.Conflict(ValidationMessages.CONFLICT_EXISTING_BOOKED_SESSIONS);
        }

        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var effectiveStartDate = today;
            var effectiveEndDate = today.AddYears(1); // Define the range for updates, e.g., next year

            var updatedDays = await _dayRepo.UpdateScheduleSettingsAndGetUpdatedDaysAsync(
                mentorId,
                effectiveStartDate,
                effectiveEndDate,
                workDayStartTime,
                workDayEndTime,
                sessionDuration,
                bufferTime
            );

            foreach (var day in updatedDays)
            {
                var existingSlots = day.MentorTimeAvailables.ToList();
                if (existingSlots.Any())
                {
                    _timeSlotRepository.DeleteRange(existingSlots);
                    day.MentorTimeAvailables.Clear();
                }

                var currentTime = day.StartWorkTime;
                while (currentTime < day.EndWorkTime)
                {
                    var slotEnd = currentTime.Add(day.SessionDuration.ToTimeSpan());
                    if (slotEnd > day.EndWorkTime) break;

                    var newSlot = new MentorTimeAvailable
                    {
                        Id = Guid.NewGuid(),
                        DayId = day.Id,
                        Start = currentTime,
                        End = slotEnd,
                        StatusId = 1, // 1 for Available (SessionAvailabilityStatus.Available)
                    };
                    day.MentorTimeAvailables.Add(newSlot);
                    currentTime = slotEnd.Add(day.BufferTime.ToTimeSpan());
                }
                _dayRepo.Update(day);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            var responseDto = new ScheduleConfigurationResponseDto
            {
                MentorId = mentorId,
                WorkDayStartTime = workDayStartTime.ToString("HH:mm"),
                WorkDayEndTime = workDayEndTime.ToString("HH:mm"),
                SessionDurationInMinutes = requestDto.SessionDurationInMinutes,
                BufferTimeInMinutes = requestDto.BufferTimeInMinutes,
                LastUpdatedAt = DateTime.UtcNow
            };
            // The OperationResult.Ok method does not take a message. 
            // The ValidationMessages.SCHEDULE_CONFIG_UPDATE_SUCCESS can be used by the controller/client if needed.
            return OperationResult<ScheduleConfigurationResponseDto>.Ok(responseDto);
        }
        catch (DbUpdateException ex) // More specific exception
        {
            await _unitOfWork.RollbackAsync();
            // Log ex.InnerException or ex.ToString()
            return OperationResult<ScheduleConfigurationResponseDto>.Fail($"Database error while updating schedule: {ex.Message}", HttpStatusCode.InternalServerError);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync();
            // Log ex.ToString()
            return OperationResult<ScheduleConfigurationResponseDto>.Fail($"An error occurred while updating schedule configuration: {ex.Message}", HttpStatusCode.InternalServerError);
        }
    }

    private static DayAvailabilityDto MapToDayDto(MentorDayAvailable entity)
    {
        var dto = new DayAvailabilityDto
        {
            Date = entity.Day.ToString("yyyy-MM-dd"),
            DayName = entity.Day.DayOfWeek.ToString(),
            WorkStartTime = entity.StartWorkTime.ToString("HH:mm"),
            WorkEndTime = entity.EndWorkTime.ToString("HH:mm"),
            SessionDurationMinutes = (int)entity.SessionDuration.Minute + entity.SessionDuration.Hour * 60,
            BufferMinutes = (int)entity.BufferTime.Minute + entity.BufferTime.Hour * 60,
            TimeBlocks = entity.MentorTimeAvailables.Select(tb => new TimeBlockDto
            {
                Id = tb.Id,
                StartTime = tb.Start.ToString("HH:mm"),
                EndTime = tb.End.ToString("HH:mm"),
                IsSelected = tb.StatusId == 1,
                IsBooked = tb.SessionBookings.Any()
            }).OrderBy(tb => tb.StartTime).ToList()
        };
        return dto;
    }
}