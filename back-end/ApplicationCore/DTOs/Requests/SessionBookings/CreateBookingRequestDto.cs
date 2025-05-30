namespace ApplicationCore.DTOs.Requests.SessionBookings
{
    public class CreateBookingRequestDto
    {
        public Guid MentorId { get; set; }
        public Guid AvailabilitySlotId { get; set; }
        public string? LearnerMessage { get; set; }
        public int SessionTypeId { get; set; }
    }
}
