namespace ApplicationCore.DTOs.Requests.Availability;

public class SaveDaysAvailabilityRequestDto
{
    public required IList<MentorAvailabilityRequestDto> Days { get; set; } =
        new List<MentorAvailabilityRequestDto>();
}
