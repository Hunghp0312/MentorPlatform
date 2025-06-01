namespace ApplicationCore.DTOs.Responses.Availability
{
    public class ScheduleConfigurationResponseDto
    {
        public Guid MentorId { get; set; }
        public string WorkDayStartTime { get; set; } = null!;
        public string WorkDayEndTime { get; set; } = null!;
        public int SessionDurationInMinutes { get; set; }
        public int BufferTimeInMinutes { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }
}
