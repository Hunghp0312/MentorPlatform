using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class MentorApplication
    {
        public Guid Id { get; set; }
        public Guid ApplicantId { get; set; }
        public int ApplicationStatusId { get; set; }
        public string MotivationStatement { get; set; } = string.Empty;
        public string SubmissionDate { get; set; } = string.Empty;
        public DateTime? LastStatusUpdateDate { get; set; }
        public Guid? AdminReviewerId { get; set; }
        public string? AdminComments { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual User Applicant { get; set; } = null!;
        public virtual ApplicationStatus ApplicationStatus { get; set; } = null!;
        public virtual User? AdminReviewer { get; set; }
        public virtual ICollection<MentorEducation> MentorEducations { get; set; } = new List<MentorEducation>();
        public virtual ICollection<MentorWorkExperience> MentorWorkExperiences { get; set; } = new List<MentorWorkExperience>();
        public virtual ICollection<MentorCertification> MentorCertifications { get; set; } = new List<MentorCertification>();
        public virtual ICollection<SupportingDocument> SupportingDocuments { get; set; } = new List<SupportingDocument>();
    }
}
