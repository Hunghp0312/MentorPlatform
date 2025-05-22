using ApplicationCore.DTOs.Responses.ArenaOfExpertises;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class MentorMappingExtension
    {
        public static MetorApplicantResponse ToMetorApplicantResponse(this MentorApplication mentorApplication)
        {
            return new MetorApplicantResponse
            {
                Id = mentorApplication.Id,
                Avatar = mentorApplication.ApplicantUser?.UserProfile?.PhotoUrl ?? [],
                FullName = mentorApplication.ApplicantUser?.UserProfile?.FullName ?? string.Empty,
                Email = mentorApplication.ApplicantUser?.Email ?? string.Empty,
                ExpertiseAreas = mentorApplication.ApplicantUser?.UserProfile?.UserArenaOfExpertises.Select(x => new ArenaOfExpertiseResponse
                {
                    Name = x.ArenaOfExpertise.Name,
                }).ToList() ?? new List<ArenaOfExpertiseResponse>(),
                ProfessionExperience = mentorApplication.ApplicantUser?.UserProfile?.IndustryExperience ?? string.Empty,
                ApplicationTimeline = mentorApplication.SubmissionDate.ToString("yyyy-MM-dd"),
                SubmissionDate = mentorApplication.SubmissionDate,
                LastStatusUpdateDate = mentorApplication.LastStatusUpdateDate,
                AdminReviewerId = mentorApplication.AdminReviewerId,
                AdminComments = mentorApplication.AdminComments,
                RejectionReason = mentorApplication.RejectionReason,
                ApprovalDate = mentorApplication.ApprovalDate,
                CreatedAt = mentorApplication.CreatedAt,
                UpdatedAt = mentorApplication.UpdatedAt,
                Documents = mentorApplication.SupportingDocuments.Select(x => new SupportingDocumentResponse
                {
                    FileName = x.FileName,
                    FileId = x.Id,
                }).ToList(),
                Status = mentorApplication.ApplicationStatus,
            };
        }
        public static List<MetorApplicantResponse> ToMetorApplicantResponseList(this ICollection<MentorApplication> mentorApplications)
        {
            return mentorApplications.Select(x => x.ToMetorApplicantResponse()).ToList();
        }
    }
}