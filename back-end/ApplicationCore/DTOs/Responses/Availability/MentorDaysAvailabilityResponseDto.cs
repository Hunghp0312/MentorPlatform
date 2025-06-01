namespace ApplicationCore.DTOs.Responses.Availability;

public class MentorDaysAvailabilityResponseDto
{
    public required Guid MentorId { get; set; }

    public required IList<DayAvailabilityDto> Days { get; set; } = new List<DayAvailabilityDto>();
}
