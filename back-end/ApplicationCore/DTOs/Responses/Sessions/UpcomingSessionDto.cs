﻿namespace ApplicationCore.DTOs.Responses.Sessions
{
    public class UpcomingSessionDto
    {
        public Guid BookingId { get; set; }
        public Guid LearnerId { get; set; }
        public required string LearnerPhotoData { get; set; }
        public string LearnerFullName { get; set; } = string.Empty;
        public Guid AvailabilityTimeSlotId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly SlotStartTime { get; set; }
        public TimeOnly SlotEndTime { get; set; }
        public string? LearnerMessage { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public string SessionTypeName { get; set; } = string.Empty;
    }
}
