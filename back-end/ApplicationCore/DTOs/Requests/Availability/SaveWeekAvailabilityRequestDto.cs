namespace ApplicationCore.DTOs.Requests.Availability;

public class SaveWeekAvailabilityRequestDto
{
    public required Guid MentorId { get; set; }
    public required string WeekStartDate { get; set; }
    public required IList<SaveDayAvailabilityRequestDto> Days { get; set; } = new List<SaveDayAvailabilityRequestDto>();
}

public class SaveDayAvailabilityRequestDto
{
    public required string Date { get; set; }
    public string? WorkStartTime { get; set; }
    public string? WorkEndTime { get; set; }
    public int? SessionDurationMinutes { get; set; }
    public int? BufferMinutes { get; set; }
    public required IList<TimeBlockRequestDto> TimeBlocks { get; set; } = new List<TimeBlockRequestDto>();
}