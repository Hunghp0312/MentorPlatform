using ApplicationCore.DTOs.Responses.AreaOfExpertises;


namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorApplicantResponse
    {
        public required string PhotoData { get; set; }
        public required string FullName { get; set; }
        public Guid ApplicantUserId { get; set; }
        public string SubmissionDate { get; set; } = string.Empty;
        public ICollection<AreaOfExpertiseResponse> ExpertiseAreas { get; set; } = [];
        public required string Status { get; set; }

    }
}