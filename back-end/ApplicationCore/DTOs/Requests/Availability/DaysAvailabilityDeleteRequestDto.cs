namespace ApplicationCore.DTOs.Requests.Availability
{
    public class DaysAvailabilityDeleteRequestDto
    {
        public required ICollection<string> days { get; set; }
    }
}
