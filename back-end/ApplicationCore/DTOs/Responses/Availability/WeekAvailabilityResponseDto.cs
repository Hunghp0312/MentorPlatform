namespace ApplicationCore.DTOs.Responses.Availability;

public class WeekAvailabilityResponseDto
{
    public required string WeekStartDate { get; set; } // ISO Sunday
    public required string WeekEndDate { get; set; }

    public required IList<DayAvailabilityDto> Days { get; set; } = new List<DayAvailabilityDto>();
}