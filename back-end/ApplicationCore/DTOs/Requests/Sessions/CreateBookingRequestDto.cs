namespace ApplicationCore.DTOs.Requests.Sessions
{
    public class CreateBookingRequestDto
    {
        public Guid MentorId { get; set; }
        public Guid MentorTimeAvailableId { get; set; }
        public string? LearnerMessage { get; set; }
        public int SessionTypeId { get; set; }
    }
}
