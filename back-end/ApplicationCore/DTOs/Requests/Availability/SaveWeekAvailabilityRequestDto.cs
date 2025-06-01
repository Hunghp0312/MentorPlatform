namespace ApplicationCore.DTOs.Requests.Availability;

public class SaveWeekAvailabilityRequestDto
{
    public required Guid MentorId { get; set; }
    public required string WeekStartDate { get; set; }
    public required IList<SaveDayAvailabilityRequestDto> Days { get; set; } =
        new List<SaveDayAvailabilityRequestDto>();
}
