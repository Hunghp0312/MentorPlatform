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
            Days = days.Select(day => day.MapToDayDto()).ToList(),
        };

        // ensure all 7 days present
        for (int i = 0; i < 7; i++)
        {
            var currentDate = weekStartDate.AddDays(i);
            var existing = weekDto.Days.FirstOrDefault(d =>
                d.Date == currentDate.ToString(DatetimeFormat.dayFormat)
            );
            if (existing == null)
            {
                weekDto.Days.Add(
                    new DayAvailabilityDto
                    {
                        Date = currentDate.ToString(DatetimeFormat.dayFormat),
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
            var mentorId = requestDto.MentorId;
            foreach (var dayDto in requestDto.Days)
            {
                await UpdateOrCreateMentorDayAvailableAsync(mentorId, dayDto);
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

        // update work hours
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

        // handle time blocks
        // simplistic approach: clear and recreate (optimize later)
        existingDay.MentorTimeAvailables.Clear();
        foreach (var blockDto in dayDto.TimeBlocks)
        {
            var block = new MentorTimeAvailable
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
                StatusId = blockDto.IsSelected ? 1 : 3, // 1: available, 3: unavailable
            };
            existingDay.MentorTimeAvailables.Add(block);
        }

        _dayRepo.Update(existingDay);
    }
}
