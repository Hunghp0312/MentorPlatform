namespace ApplicationCore.DTOs.Requests.Availability
{
    public class SaveDayAvailabilityRequestDto
    {
        public required string Date { get; set; } // ISO date (YYYY-MM-DD)
        public string? WorkStartTime { get; set; } // HH:mm, nullable if using default
        public string? WorkEndTime { get; set; }
        public int? SessionDurationMinutes { get; set; }
        public int? BufferMinutes { get; set; }
        public required IList<TimeBlockRequestDto> TimeBlocks { get; set; } =
            new List<TimeBlockRequestDto>();
    }
}
