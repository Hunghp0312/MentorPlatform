using ApplicationCore.DTOs.Responses.ArenaOfExpertises;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class MentorMappingExtension
    {
        public static MentorApplicantResponse ToMetorApplicantResponse(this MentorApplication mentorApplication)
        {
            return new MentorApplicantResponse
            {
                ApplicantUserId = mentorApplication.ApplicantId,
                PhotoData = mentorApplication.Applicant?.UserProfile?.PhotoData != null
                    ? Convert.ToBase64String(mentorApplication.Applicant.UserProfile.PhotoData)
                    : string.Empty,
                FullName = mentorApplication.Applicant?.UserProfile?.FullName ?? string.Empty,
                Email = mentorApplication.Applicant?.Email ?? string.Empty,
                ExpertiseAreas = mentorApplication.Applicant?.UserArenaOfExpertises.Select(x => new ArenaOfExpertiseResponse
                {
                    Name = x.AreaOfExpertise.Name,
                }).ToList() ?? new List<ArenaOfExpertiseResponse>(),
                ProfessionExperience = mentorApplication.Applicant?.UserProfile?.IndustryExperience ?? string.Empty,
                ApplicationTimeline = mentorApplication.SubmissionDate,
                SubmissionDate = mentorApplication.SubmissionDate,
                LastStatusUpdateDate = mentorApplication.LastStatusUpdateDate,
                ApproverName = mentorApplication.AdminReviewer?.UserProfile?.FullName ?? string.Empty,
                AdminComments = mentorApplication.AdminComments,
                RejectionReason = mentorApplication.RejectionReason,
                RequestInfoDate = mentorApplication.RequestInfoDate,    
                ApprovalDate = mentorApplication.ApprovalDate,
                CreatedAt = mentorApplication.CreatedAt,
                UpdatedAt = mentorApplication.UpdatedAt,
                Documents = mentorApplication.SupportingDocuments.Select(x => new SupportingDocumentResponse
                {
                    FileName = x.FileName,
                    FileId = x.Id,
                }).ToList(),
                Status = mentorApplication.ApplicationStatus.Name,
            };
        }
        public static List<MentorApplicantResponse> ToMetorApplicantResponseList(this ICollection<MentorApplication> mentorApplications)
        {
            return mentorApplications.Select(x => x.ToMetorApplicantResponse()).ToList();
        }
    }
}