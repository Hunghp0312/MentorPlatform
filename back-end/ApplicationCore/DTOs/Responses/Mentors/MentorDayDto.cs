namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorDayDto
    {
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
        public List<MentorTimeSlotDto> MentorTimeSlots { get; set; } = new List<MentorTimeSlotDto>();
    }
}
