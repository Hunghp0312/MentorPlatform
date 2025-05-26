using ApplicationCore.DTOs.Requests.Certifications;
using ApplicationCore.DTOs.Requests.Educations;
using ApplicationCore.DTOs.Requests.WorkExperiences;

namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class BaseMentorApplicationResponse
    {
        public Guid Id { get; set; }
        public Guid ApplicantUserId { get; set; }
        public string ApplicantFullName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string SubmissionDate { get; set; } = string.Empty;
        public List<EducationDetailDto> EducationDetails { get; set; } = new List<EducationDetailDto>();
        public List<WorkExperienceDetailDto> WorkExperienceDetails { get; set; } = new List<WorkExperienceDetailDto>();
        public List<CertificationDetailDto> Certifications { get; set; } = new List<CertificationDetailDto>();
        public int NumberOfSupportingDocuments { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastStatusUpdateDate { get; set; }
    }
}
