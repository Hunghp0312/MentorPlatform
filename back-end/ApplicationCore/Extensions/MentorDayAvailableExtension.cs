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
                PhotoData = mentorDay.Mentor.UserProfile.PhotoData != null
                ? $"data:image/png;base64,{Convert.ToBase64String(mentorDay.Mentor.UserProfile.PhotoData)}"
                : string.Empty,
                Date = mentorDay.Day,
                StartWorkTime = mentorDay.StartWorkTime,
                EndWorkTime = mentorDay.EndWorkTime,
                MentorFullName = mentorDay.Mentor.UserProfile.FullName,
                ExpertiseTags = mentorDay.Mentor.UserAreaOfExpertises.Select(x => x.AreaOfExpertise.Name).ToList(),
                MentorTimeSlots = mentorDay.MentorTimeAvailables.Select(mta => mta.ToMentorTimeSlotDto()).ToList()
            };
        }
    }
}
