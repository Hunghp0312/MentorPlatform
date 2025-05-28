using ApplicationCore.DTOs.Responses.ArenaOfExpertises;
using ApplicationCore.DTOs.Responses.MentorCertifications;
using ApplicationCore.DTOs.Responses.MentorEducations;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.DTOs.Responses.MentorWorkExperiences;
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
                EducationDetails = mentorApplication.MentorEducations.Select(e => e.ToEducationDetailDto()).ToList(),
                WorkExperienceDetails = mentorApplication.MentorWorkExperiences.Select(w => w.ToWorkExperienceDetailDto()).ToList(),
                Certifications = mentorApplication.MentorCertifications.Select(c => c.ToCertificationDetailDto()).ToList(),
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
                    FileContent = x.DocumentContent.FileContent ?? Array.Empty<byte>(),
                    FileType = x.DocumentContent.FileType ?? string.Empty,
                }).ToList(),
                Status = mentorApplication.ApplicationStatus.Name,
                MentorEducations = mentorApplication.MentorEducations.Select(x => new MentorEducationReponse
                {
                    FieldOfStudy = x.FieldOfStudy,
                    InstitutionName = x.InstitutionName,
                    GraduationYear = x.GraduationYear
                }).ToList(),
                MentorWorkExperiences = mentorApplication.MentorWorkExperiences.Select(x => new MentorWorkExperienceResponse
                {
                    CompanyName = x.CompanyName,
                    Position = x.Position,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Description = x.Description
                }).ToList(),
                MentorCertifications = mentorApplication.MentorCertifications.Select(x => new MentorCertificationResponse
                {
                    CertificationName = x.CertificationName,
                    IssuingOrganization = x.IssuingOrganization,
                }).ToList()
                
            };
        }
        public static List<MentorApplicantResponse> ToMetorApplicantResponseList(this ICollection<MentorApplication> mentorApplications)
        {
            return mentorApplications.Select(x => x.ToMetorApplicantResponse()).ToList();
        }
    }
}