namespace ApplicationCore.DTOs.Requests.Availability;

public class TimeBlockRequestDto
{
    public Guid? Id { get; set; }
    public required string StartTime { get; set; } // HH:mm format
    public required string EndTime { get; set; }   // HH:mm format
    public bool IsSelected { get; set; }
}