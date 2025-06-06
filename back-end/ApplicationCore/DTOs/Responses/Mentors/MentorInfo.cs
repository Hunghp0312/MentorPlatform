namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorInfo
    {
        public string MentorFullName { get; set; } = string.Empty;
        public required string PhotoData { get; set; }
        public List<string> ExpertiseTags { get; set; } = new List<string>();
    }
}
