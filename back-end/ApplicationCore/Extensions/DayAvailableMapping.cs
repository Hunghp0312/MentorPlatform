using ApplicationCore.Constants;
using ApplicationCore.DTOs.Responses.Availability;
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
                    entity.SessionDuration.Minute + entity.SessionDuration.Hour * 60,
                BufferMinutes = entity.BufferTime.Minute + entity.BufferTime.Hour * 60,
                TimeBlocks = entity
                    .MentorTimeAvailables.Select(tb => new TimeBlockDto
                    {
                        Id = tb.Id,
                        StartTime = tb.Start.ToString(DatetimeFormat.hourFormat),
                        EndTime = tb.End.ToString(DatetimeFormat.hourFormat),
                        SessionStatus = tb.Status,
                    })
                    .OrderBy(tb => tb.StartTime)
                    .ToList(),
            };
            return dto;
        }

        public static DayAvailabilityDto DefaultReponse(DateOnly day)
        {
            var response = new DayAvailabilityDto
            {
                Date = day.ToString(DatetimeFormat.dayFormat),
                DayName = day.DayOfWeek.ToString(),
                WorkStartTime = "09:00",
                WorkEndTime = "17:00",
                SessionDurationMinutes = 45,
                BufferMinutes = 15,
                TimeBlocks = [],
            };

            return response;
        }
    }
}
