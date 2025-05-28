
namespace ApplicationCore.DTOs.Responses.MentorWorkExperiences
{
    public class MentorWorkExperienceResponse
    {
        public string CompanyName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Description { get; set; }
    }
}