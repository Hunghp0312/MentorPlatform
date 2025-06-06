namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorDayDto
    {
        public Guid Id { get; set; }
        public string PhotoData { get; set; } = string.Empty;
        public TimeOnly StartWorkTime { get; set; }
        public TimeOnly EndWorkTime { get; set; }
        public List<string> ExpertiseTags { get; set; } = new List<string>();
        public string MentorFullName { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public List<MentorTimeSlotDto> MentorTimeSlots { get; set; } = new List<MentorTimeSlotDto>();
    }
}
