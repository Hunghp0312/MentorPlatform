using ApplicationCore.DTOs.Responses.AreaOfExpertises;
using ApplicationCore.DTOs.Responses.MentorCertifications;
using ApplicationCore.DTOs.Responses.MentorEducations;
using ApplicationCore.DTOs.Responses.MentorWorkExperiences;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorApplicationDetailDto
    {
        public required string PhotoData { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public Guid ApplicantUserId { get; set; }
        public string SubmissionDate { get; set; } = string.Empty;
        public DateTime? LastStatusUpdateDate { get; set; }
        public string ApproverName { get; set; } = string.Empty;
        public string? AdminComments { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string? RequestInfoDate { get; set; }
        public ICollection<AreaOfExpertiseResponse> ExpertiseAreas { get; set; } = [];
        public required string ProfessionExperience { get; set; }
        public List<SupportingDocumentResponse>? Documents { get; set; }
        public List<MentorEducationReponse> MentorEducations { get; set; } = new List<MentorEducationReponse>();
        public List<MentorWorkExperienceResponse> MentorWorkExperiences { get; set; } = new List<MentorWorkExperienceResponse>();
        public List<MentorCertificationResponse> MentorCertifications { get; set; } = new List<MentorCertificationResponse>();
        public required string Status { get; set; }
    }
}