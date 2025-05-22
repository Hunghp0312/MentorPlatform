using ApplicationCore.DTOs.Responses.ArenaOfExpertises;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MetorApplicantResponse
    {
        public Guid Id { get; set; }
        public required byte[] Avatar { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public Guid ApplicantUserId { get; set; }
        public string MotivationStatement { get; set; } = string.Empty;
        public string SubmissionDate { get; set; } = string.Empty;
        public DateTime? LastStatusUpdateDate { get; set; }
        public Guid? AdminReviewerId { get; set; }
        public string? AdminComments { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<ArenaOfExpertiseResponse> ExpertiseAreas { get; set; } = [];
        public required string ProfessionExperience { get; set; }
        public required string ApplicationTimeline { get; set; }
        public List<SupportingDocumentResponse>? Documents { get; set; }
        public required ApplicationStatus Status { get; set; }

    }
}