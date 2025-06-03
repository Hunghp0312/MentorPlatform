namespace ApplicationCore.DTOs.Responses.Availability;

public class DayAvailabilityDto
{
    public required string Date { get; set; }
    public string DayName { get; set; } = string.Empty;
    public string? WorkStartTime { get; set; }
    public string? WorkEndTime { get; set; }
    public int? SessionDurationMinutes { get; set; }
    public int? BufferMinutes { get; set; }
    public required IList<TimeBlockDto> TimeBlocks { get; set; } = new List<TimeBlockDto>();
}