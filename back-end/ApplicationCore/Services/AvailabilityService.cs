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
    private readonly ISessionBookingRepository _sessionRepo;
    private readonly IMentorTimeAvailableRepository _timeAvailRepo;
    private readonly IUnitOfWork _unitOfWork;
    public AvailabilityService(
        IMentorDayAvailableRepository dayRepo,
        IUnitOfWork unitOfWork,
        ISessionBookingRepository sessionRepo,
        IMentorTimeAvailableRepository timeAvailRepo
    )
    {
        _dayRepo = dayRepo;
        _unitOfWork = unitOfWork;
        _sessionRepo = sessionRepo;
        _timeAvailRepo = timeAvailRepo;
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

    public async Task<OperationResult<string>> SaveMentorDaysAvailability(
        Guid mentorId,
        SaveDaysAvailabilityRequestDto requestDto
    )
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            foreach (var dayDto in requestDto.Days)
            {
                var result = await ProcessDayAvailabilityAsync(mentorId, dayDto);
                if (result != null && !result.Success)
                {
                    return result;
                }
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return OperationResult<string>.NoContent();
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync();
            return OperationResult<string>.Fail($"Failed to save availability: {ex.Message}");
        }
    }

    private async Task<OperationResult<string>?> ProcessDayAvailabilityAsync(
        Guid mentorId,
        MentorAvailabilityRequestDto dayDto
    )
    {
        var date = DateOnly.Parse(dayDto.Date, System.Globalization.CultureInfo.InvariantCulture);

        if (date < DateOnly.FromDateTime(DateTime.UtcNow.Date))
        {
            return null;
        }

        var existingDay = await _dayRepo.GetByMentorAndDateAsync(mentorId, date);

        if (existingDay == null)
        {
            existingDay = await CreateNewDayAsync(mentorId, date);
        }
        else
        {
            var result = await HandleExistingDayAsync(existingDay, dayDto);
            if (result != null)
            {
                return result;
            }
        }

        UpdateWorkHours(existingDay, dayDto);

        var requestBlockIds = dayDto
            .TimeBlocks.Where(tb => tb.Id != null)
            .Select(tb => tb.Id)
            .ToHashSet();
        var toRemove = existingDay
            .MentorTimeAvailables.Where(mta => !requestBlockIds.Contains(mta.Id))
            .ToList();
        foreach (var removeBlock in toRemove)
        {
            existingDay.MentorTimeAvailables.Remove(removeBlock);
        }

        foreach (var blockDto in dayDto.TimeBlocks)
        {
            if (
                blockDto.Id == null
                || !existingDay.MentorTimeAvailables.Any(mta => mta.Id == blockDto.Id)
            )
            {
                await AddTimeBlockAsync(existingDay, blockDto);
            }
        }
        _dayRepo.Update(existingDay);
        return null;
    }

    private async Task<MentorDayAvailable> CreateNewDayAsync(Guid mentorId, DateOnly date)
    {
        var newDay = new MentorDayAvailable
        {
            Id = Guid.NewGuid(),
            MentorId = mentorId,
            Day = date,
        };
        await _dayRepo.AddAsync(newDay);
        await _unitOfWork.SaveChangesAsync();
        return newDay;
    }

    private async Task<OperationResult<string>?> HandleExistingDayAsync(
        MentorDayAvailable existingDay,
        MentorAvailabilityRequestDto dayDto
    )
    {
        var existingTimeBlockIds = existingDay.MentorTimeAvailables.Select(mta => mta.Id).ToList();
        var isReference = await _sessionRepo.AnyAsync(sb =>
            existingTimeBlockIds.Contains(sb.MentorTimeAvailableId)
        );

        var requestTimeBlockIds = dayDto.TimeBlocks.Select(tb => tb.Id).ToList();

        var isHaveBookedTime =
            existingDay
                .MentorTimeAvailables.Where(mta =>
                    mta.StatusId == 2 || mta.StatusId == 3 || mta.StatusId == 4
                )
                .All(mta => requestTimeBlockIds.Contains(mta.Id)) == false;

        if (!dayDto.TimeBlocks.Any() && !isReference)
        {
            _dayRepo.Delete(existingDay);
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<string>.NoContent();
        }
        else if (isHaveBookedTime)
        {
            return OperationResult<string>.Fail(
                "Cannot update time blocks for a day that has referenced sessions."
            );
        }

        return null;
    }

    private void UpdateWorkHours(
        MentorDayAvailable existingDay,
        MentorAvailabilityRequestDto dayDto
    )
    {
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
    }

    private async Task AddTimeBlockAsync(
        MentorDayAvailable existingDay,
        TimeBlockRequestDto blockDto
    )
    {
        var blockStart = TimeOnly.Parse(
            blockDto.StartTime,
            System.Globalization.CultureInfo.InvariantCulture
        );
        var blockEnd = TimeOnly.Parse(
            blockDto.EndTime,
            System.Globalization.CultureInfo.InvariantCulture
        );

        var workStart = existingDay.StartWorkTime;
        var workEnd = existingDay.EndWorkTime;
        var sessionDuration =
            existingDay.SessionDuration != null
                ? existingDay.SessionDuration.ToTimeSpan()
                : TimeSpan.Zero;

        var blockDuration = blockEnd.ToTimeSpan() - blockStart.ToTimeSpan();

        if (blockStart < workStart || blockEnd > workEnd || blockDuration != sessionDuration)
        {
            throw new InvalidOperationException(
                "Invalid time block: outside work hours or incorrect duration."
            );
        }

        var timeBlock = new MentorTimeAvailable
        {
            Id = Guid.NewGuid(),
            Start = blockStart,
            End = blockEnd,
            DayId = existingDay.Id,
            StatusId = blockDto.SessionStatus,
            MentorDayAvailable = existingDay,
        };
        await _timeAvailRepo.AddAsync(timeBlock);
        await _unitOfWork.SaveChangesAsync();

        existingDay.MentorTimeAvailables.Add(timeBlock);
    }

    public async Task<OperationResult<DayAvailabilityDto>> GetDayAvailabilityAsync(
        Guid mentorId,
        DateOnly day
    )
    {
        var response = await _dayRepo.GetDayAvailabilityAsync(mentorId, day);
        if (response == null)
        {
            return OperationResult<DayAvailabilityDto>.Ok(DayAvailableMapping.DefaultReponse(day));
        }
        return OperationResult<DayAvailabilityDto>.Ok(response.MapToDayDto());
    }
}
