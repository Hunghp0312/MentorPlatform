using ApplicationCore.DTOs.Responses.Mentors;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class MentorDayAvailableExtension
    {
        public static MentorDayDto ToMentorDayDto(this MentorDayAvailable mentorDay)
        {
            return new MentorDayDto
            {
                Id = mentorDay.Id,
                Date = mentorDay.Day,
                MentorTimeSlots = mentorDay.MentorTimeAvailables.Select(mta => mta.ToMentorTimeSlotDto()).ToList()
            };
        }
    }
}
