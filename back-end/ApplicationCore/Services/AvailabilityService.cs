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
                await UpdateOrCreateMentorDayAvailableAsync(mentorId, dayDto);
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
            await _unitOfWork.SaveChangesAsync();
        }
        else
        {
            var existingTimeBlockIds = existingDay
                .MentorTimeAvailables.Select(mta => mta.Id)
                .ToList();
            var isReference = await _sessionRepo.AnyAsync(sb =>
                existingTimeBlockIds.Contains(sb.MentorTimeAvailableId)
            );
            if (!dayDto.TimeBlocks.Any() && !isReference)
            {
                _dayRepo.Delete(existingDay);
                await _unitOfWork.SaveChangesAsync();
                return;
            }
            else if (isReference)
            {
                throw new InvalidOperationException(
                    "Cannot update time blocks for a day that has referenced sessions."
                );
            }
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

        existingDay.MentorTimeAvailables.Clear();
        foreach (var blockDto in dayDto.TimeBlocks)
        {
            var blockStart = TimeOnly.Parse(
                blockDto.StartTime,
                System.Globalization.CultureInfo.InvariantCulture
            );
            var blockEnd = TimeOnly.Parse(
                blockDto.EndTime,
                System.Globalization.CultureInfo.InvariantCulture
            );

            var blockDuration = blockEnd.ToTimeSpan() - blockStart.ToTimeSpan();

            if (
                blockStart < existingDay.StartWorkTime
                || blockEnd > existingDay.EndWorkTime
                || blockDuration != existingDay.SessionDuration.ToTimeSpan()
            )
            {
                throw new InvalidOperationException(
                    "Invalid time block: outside work hours or incorrect duration."
                );
            }

            var timeBlock = new MentorTimeAvailable
            {
                Id = blockDto.Id ?? Guid.NewGuid(),
                Start = blockStart,
                End = blockEnd,
                DayId = existingDay.Id,
                StatusId = blockDto.SessionStatus,
            };
            await _timeAvailRepo.AddAsync(timeBlock);

            existingDay.MentorTimeAvailables.Add(timeBlock);
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
            return OperationResult<DayAvailabilityDto>.Ok(DayAvailableMapping.DefaultReponse(day));
        }
        return OperationResult<DayAvailabilityDto>.Ok(response.MapToDayDto());
    }
}
