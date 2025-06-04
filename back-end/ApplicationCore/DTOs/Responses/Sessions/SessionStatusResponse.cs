using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Sessions
{
    public class SessionStatusResponse
    {
        public Guid LearnerId { get; set; }
        public required string FullName { get; set; }
        public Guid SessionId { get; set; }
        public required SessionBookingStatus SessionStatus { get; set; }
        public DateTime SlotStartTime { get; set; }
        public DateTime SlotEndTime { get; set; }
        public required SessionType SessionType { get; set; }
        public DateOnly BookingDay { get; set; }
    }
}