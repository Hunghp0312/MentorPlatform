using ApplicationCore.DTOs.Responses.AreaOfExpertises;
using ApplicationCore.DTOs.Responses.MentorCertifications;
using ApplicationCore.DTOs.Responses.MentorEducations;
using ApplicationCore.DTOs.Responses.MentorWorkExperiences;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using ApplicationCore.DTOs.Responses.TeachingApproachs;

namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorProfileDto
    {
        public required string PhotoData { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public Guid ApplicantUserId { get; set; }
        public DateTime? LastStatusUpdateDate { get; set; }
        public string? Bio { get; set; }
        public ICollection<AreaOfExpertiseResponse> ExpertiseAreas { get; set; } = [];
        public required string ProfessionExperience { get; set; }
        public List<SupportingDocumentResponse>? Documents { get; set; }
        public List<MentorEducationReponse> MentorEducations { get; set; } = new List<MentorEducationReponse>();
        public List<MentorWorkExperienceResponse> MentorWorkExperiences { get; set; } = new List<MentorWorkExperienceResponse>();
        public List<MentorCertificationResponse> MentorCertifications { get; set; } = new List<MentorCertificationResponse>();
        public List<TeachingApproachResponse> TeachingApproachResponses { get; set; } = new List<TeachingApproachResponse>();
    }
}
