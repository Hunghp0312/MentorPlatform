namespace ApplicationCore.DTOs.Responses.Availability;

public class TimeBlockDto
{
    public required Guid Id { get; set; }
    public required string StartTime { get; set; } // HH:mm
    public required string EndTime { get; set; }   // HH:mm
    public bool IsSelected { get; set; }
    public bool IsBooked { get; set; }
}