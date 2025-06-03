namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorTimeSlotDto
    {
        public Guid Id { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int StatusId { get; set; }
    }
}
