namespace ApplicationCore.DTOs.Requests.Availability
{
    public class UpdateScheduleConfigurationRequestDto
    {
        public string WorkDayStartTime { get; set; } = null!;
        public string WorkDayEndTime { get; set; } = null!;
        public int SessionDurationInMinutes { get; set; }
        public int BufferTimeInMinutes { get; set; }
    }
}
