using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly IMentorDayAvailableRepository _dayRepo;
    private readonly IUnitOfWork _unitOfWork;

    public AvailabilityService(IMentorDayAvailableRepository dayRepo, IUnitOfWork unitOfWork)
    {
        _dayRepo = dayRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<OperationResult<MentorDaysAvailabilityResponseDto>> GetWeekAvailabilityAsync(
        Guid mentorId,
        DateOnly weekStartDate
    )
    {
        var weekEnd = weekStartDate.AddDays(6);
        var days = await _dayRepo.GetByMentorAndDateRangeAsync(mentorId, weekStartDate, weekEnd);

        var weekDto = new WeekAvailabilityResponseDto
        {
            MentorId = mentorId,
            WeekStartDate = weekStartDate.ToString(DatetimeFormat.dayFormat),
            WeekEndDate = weekEnd.ToString(DatetimeFormat.dayFormat),
            Days = days.Select(day => day.MapToDayDto()).ToList(),
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

        return OperationResult<MentorDaysAvailabilityResponseDto>.Ok(weekDto);
    }

    public async Task<OperationResult<MentorDaysAvailabilityResponseDto>> GetDaysAvailabilityAsync(
        SaveDaysAvailabilityRequestDto requestDto
    )
    {
        var availableDays = await _dayRepo.GetDaysAvailabilityAsync(requestDto);

        var response = new MentorDaysAvailabilityResponseDto
        {
            MentorId = requestDto.MentorId,
            Days = availableDays.Select(day => day.MapToDayDto()).ToList(),
        };

        return OperationResult<MentorDaysAvailabilityResponseDto>.Ok(response);
    }

    public async Task<
        OperationResult<MentorDaysAvailabilityResponseDto>
    > SaveMentorDaysAvailability(Guid mentorId, SaveDaysAvailabilityRequestDto requestDto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            foreach (var dayDto in requestDto.Days)
            {
                await UpdateOrCreateMentorDayAvailableAsync(mentorId, dayDto);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return await GetDaysAvailabilityAsync(requestDto);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync();
            return OperationResult<MentorDaysAvailabilityResponseDto>.Fail(
                $"Failed to save availability: {ex.Message}"
            );
        }
    }

    public async Task UpdateOrCreateMentorDayAvailableAsync(
        Guid mentorId,
        MentorAvailabilityRequestDto dayDto
    )
    {
        var date = DateOnly.Parse(dayDto.Date, System.Globalization.CultureInfo.InvariantCulture);
        var existingDay = await _dayRepo.GetByMentorAndDateAsync(mentorId, date);

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
                    StatusId = blockDto.SessionStatus,
                }
            );
        }

        _dayRepo.Update(existingDay);
    }

    public async Task<OperationResult<DayAvailabilityDto>> GetDayAvailabilityAsync(
        Guid mentorId,
        DateOnly day
    )
    {
        var response = await _dayRepo.GetDayAvailabilityAsync(mentorId, day);
        if (response == null)
        {
            return OperationResult<DayAvailabilityDto>.Fail(
                "No availability found for the specified day."
            );
        }
        return OperationResult<DayAvailabilityDto>.Ok(response.MapToDayDto());
    }

    public async Task<OperationResult<DayAvailabilityDto>> DeleteDaysAsync(
        Guid mentorId,
        DaysAvailabilityDeleteRequestDto days
    )
    {
        var daysToDelete = days
            .days.Select(dateStr =>
                DateOnly.Parse(dateStr, System.Globalization.CultureInfo.InvariantCulture)
            )
            .ToList();

        await _dayRepo.DeleteDayAvailable(mentorId, daysToDelete);
        return OperationResult<DayAvailabilityDto>.NoContent();
    }
}
