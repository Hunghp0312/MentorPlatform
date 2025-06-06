using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Availability;

public class TimeBlockDto
{
    public required Guid Id { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
    public required SessionAvailabilityStatus SessionStatus { get; set; }
}
