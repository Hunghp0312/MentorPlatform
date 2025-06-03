using ApplicationCore.DTOs.Responses.Mentors;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class MentorTimeAvailableExtension
    {
        public static MentorTimeSlotDto ToMentorTimeSlotDto(this MentorTimeAvailable mentorTime)
        {
            return new MentorTimeSlotDto()
            {
                Id = mentorTime.Id,
                StartTime = mentorTime.Start,
                EndTime = mentorTime.End,
                StatusId = mentorTime.StatusId,
            };
        }
    }
}
