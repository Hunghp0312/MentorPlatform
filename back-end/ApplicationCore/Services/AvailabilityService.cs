using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using System.Linq;

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