namespace ApplicationCore.DTOs.Requests.Availability
{
    public class MentorAvailabilityRequestDto
    {
        public required string Date { get; set; }
        public string? WorkStartTime { get; set; }
        public string? WorkEndTime { get; set; }
        public int? SessionDurationMinutes { get; set; }
        public int? BufferMinutes { get; set; }
        public required IList<TimeBlockRequestDto> TimeBlocks { get; set; } =
            new List<TimeBlockRequestDto>();
    }
}
