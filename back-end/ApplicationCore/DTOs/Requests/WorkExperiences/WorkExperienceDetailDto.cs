namespace ApplicationCore.DTOs.Requests.WorkExperiences
{
    public class WorkExperienceDetailDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
