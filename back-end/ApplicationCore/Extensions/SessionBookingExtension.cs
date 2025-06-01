using ApplicationCore.DTOs.Responses.Sessions;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class SessionBookingExtension
    {
        public static CreatedBookingResponseDto ToCreatedBookingResponseDto(this SessionBooking sessionBooking)
        {
            return new CreatedBookingResponseDto
            {
                Id = sessionBooking.Id,
                LearnerId = sessionBooking.LearnerId,
                MentorId = sessionBooking.MentorId!,
                MentorFullName = sessionBooking.Mentor.UserProfile.FullName,
                AvailabilitySlotId = sessionBooking.MentorTimeAvailableId,
                SlotStartTime = sessionBooking.MentorTimeAvailable.Start,
                SlotEndTime = sessionBooking.MentorTimeAvailable.End,
                LearnerMessage = sessionBooking.LearnerMessage,
                StatusId = sessionBooking.StatusId,
                StatusName = sessionBooking.Status.Name,
                SessionTypeId = sessionBooking.SessionTypeId,
                SessionTypeName = sessionBooking.SessionType.Name,
                CreatedAt = sessionBooking.CreatedAt,
            };
        }
    }
}
