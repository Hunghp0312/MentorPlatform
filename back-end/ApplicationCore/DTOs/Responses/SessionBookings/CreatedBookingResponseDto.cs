namespace ApplicationCore.DTOs.Responses.SessionBookings
{
    public class CreatedBookingResponseDto
    {
        public Guid Id { get; set; }
        public Guid LearnerId { get; set; }
        public Guid MentorId { get; set; }
        public string MentorFullName { get; set; } = string.Empty;
        public Guid AvailabilitySlotId { get; set; }
        public DateTime SlotStartTime { get; set; }
        public DateTime SlotEndTime { get; set; }
        public string? LearnerMessage { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public int SessionTypeId { get; set; }
        public string SessionTypeName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
