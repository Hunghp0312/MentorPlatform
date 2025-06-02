using ApplicationCore.Constants;
using ApplicationCore.DTOs.Responses.Availability;
using Azure.Core;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class DayAvailableMapping
    {
        public static DayAvailabilityDto MapToDayDto(this MentorDayAvailable entity)
        {
            var dto = new DayAvailabilityDto
            {
                Date = entity.Day.ToString(DatetimeFormat.dayFormat),
                DayName = entity.Day.DayOfWeek.ToString(),
                WorkStartTime = entity.StartWorkTime.ToString(DatetimeFormat.hourFormat),
                WorkEndTime = entity.EndWorkTime.ToString(DatetimeFormat.hourFormat),
                SessionDurationMinutes =
                    (int)entity.SessionDuration.Minute + entity.SessionDuration.Hour * 60,
                BufferMinutes = (int)entity.BufferTime.Minute + entity.BufferTime.Hour * 60,
                TimeBlocks = entity
                    .MentorTimeAvailables.Select(tb => new TimeBlockDto
                    {
                        Id = tb.Id,
                        StartTime = tb.Start.ToString(DatetimeFormat.hourFormat),
                        EndTime = tb.End.ToString(DatetimeFormat.hourFormat),
                        IsBooked = tb.SessionBookings.Any(),
                    })
                    .OrderBy(tb => tb.StartTime)
                    .ToList(),
            };
            return dto;
        }
    }
}
