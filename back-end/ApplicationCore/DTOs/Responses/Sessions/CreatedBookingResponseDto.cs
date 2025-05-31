namespace ApplicationCore.DTOs.Responses.Sessions
{
    public class CreatedBookingResponseDto
    {
        public Guid Id { get; set; }
        public Guid LearnerId { get; set; }
        public Guid MentorId { get; set; }
        public string MentorFullName { get; set; } = string.Empty;
        public Guid AvailabilitySlotId { get; set; }
        public TimeOnly SlotStartTime { get; set; }
        public TimeOnly SlotEndTime { get; set; }
        public string? LearnerMessage { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public int SessionTypeId { get; set; }
        public string SessionTypeName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
