namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorCardDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhotoData { get; set; } = string.Empty;
        public List<string> ExpertiseTags { get; set; } = new List<string>();
        public string? ShortBioOrTagline { get; set; }
    }
}
