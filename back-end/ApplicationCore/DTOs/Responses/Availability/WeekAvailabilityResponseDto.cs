namespace ApplicationCore.DTOs.Responses.Availability
{
    public class WeekAvailabilityResponseDto : MentorDaysAvailabilityResponseDto
    {
        public required string WeekStartDate { get; set; }
        public required string WeekEndDate { get; set; }
    }
}
