namespace ApplicationCore.DTOs.Requests.Availability;

public class TimeBlockRequestDto
{
    public Guid? Id { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
    public int SessionStatus { get; set; }
}
