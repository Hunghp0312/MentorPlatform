namespace ApplicationCore.DTOs.Responses.Sessions
{
    public class MentorBookingDetailsDto
    {
        public Guid BookingId { get; set; }
        public Guid LearnerId { get; set; }
        public string LearnerFullName { get; set; } = string.Empty;
        public Guid MentorId { get; set; }
        public string MentorFullName { get; set; } = string.Empty;
        public Guid AvailabilityTimeSlotId { get; set; }
        public DateTime SlotStartTime { get; set; }
        public DateTime SlotEndTime { get; set; }
        public string? LearnerMessage { get; set; }
        public int StatusId { get; set; }
        public int SessionTypeId { get; set; }
        public DateTime BookingRequestedAt { get; set; }
    }
}
