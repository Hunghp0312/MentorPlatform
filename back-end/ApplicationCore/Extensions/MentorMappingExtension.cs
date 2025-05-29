using ApplicationCore.DTOs.Responses.AreaOfExpertises;
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
                    ? $"data:image/png;base64,{Convert.ToBase64String(mentorApplication.Applicant.UserProfile.PhotoData)}"
                    : string.Empty,
                FullName = mentorApplication.Applicant?.UserProfile?.FullName ?? string.Empty,

                ExpertiseAreas = mentorApplication.Applicant?.UserAreaOfExpertises.Select(x => new AreaOfExpertiseResponse
                {
                    Name = x.AreaOfExpertise.Name,
                }).ToList() ?? new List<AreaOfExpertiseResponse>(),

                Status = mentorApplication.ApplicationStatus.Name

            };
        }
        public static List<MentorApplicantResponse> ToMetorApplicantResponseList(this ICollection<MentorApplication> mentorApplications)
        {
            return mentorApplications.Select(x => x.ToMetorApplicantResponse()).ToList();
        }
        public static MentorApplicationDetailDto ToMentorApplicationDetailDto(this MentorApplication mentorApplication)
        {
            return new MentorApplicationDetailDto
            {
                ApplicantUserId = mentorApplication.ApplicantId,
                PhotoData = mentorApplication.Applicant?.UserProfile?.PhotoData != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(mentorApplication.Applicant.UserProfile.PhotoData)}"
                    : string.Empty,
                FullName = mentorApplication.Applicant?.UserProfile?.FullName ?? string.Empty,
                Email = mentorApplication.Applicant?.Email ?? string.Empty,
                SubmissionDate = mentorApplication.SubmissionDate,
                LastStatusUpdateDate = mentorApplication.LastStatusUpdateDate,
                ApproverName = mentorApplication.AdminReviewer?.UserProfile?.FullName ?? string.Empty,
                AdminComments = mentorApplication.AdminComments,
                RejectionReason = mentorApplication.RejectionReason,
                ApprovalDate = mentorApplication.ApprovalDate,
                RequestInfoDate = mentorApplication.RequestInfoDate,
                ExpertiseAreas = mentorApplication.Applicant?.UserAreaOfExpertises.Select(x => new AreaOfExpertiseResponse
                {
                    Name = x.AreaOfExpertise.Name,
                }).ToList() ?? new List<AreaOfExpertiseResponse>(),
                ProfessionExperience = mentorApplication?.Applicant?.UserProfile.IndustryExperience ?? string.Empty,
                Documents = mentorApplication?.SupportingDocuments?
                        .Select(sd => new SupportingDocumentResponse
                        {
                            FileName = sd.FileName,
                            FileContent = sd.DocumentContent != null
                                ? Convert.ToBase64String(sd.DocumentContent.FileContent)
                                : string.Empty,
                            FileType = sd.DocumentContent?.FileType ?? string.Empty,
                        }).ToList() ?? new List<SupportingDocumentResponse>(),
                MentorEducations = mentorApplication?.MentorEducations?
                    .Select(me => new MentorEducationReponse
                    {
                        FieldOfStudy = me.FieldOfStudy,
                        GraduationYear = me.GraduationYear,
                        InstitutionName = me.InstitutionName,

                    }).ToList() ?? new List<MentorEducationReponse>(),
                MentorWorkExperiences = mentorApplication?.MentorWorkExperiences?
                    .Select(mwe => new MentorWorkExperienceResponse
                    {
                        CompanyName = mwe.CompanyName,
                        Description = mwe.Description,
                        EndDate = mwe.EndDate,
                        StartDate = mwe.StartDate,
                        Position = mwe.Position
                    }).ToList() ?? new List<MentorWorkExperienceResponse>(),
                MentorCertifications = mentorApplication?.MentorCertifications?
                    .Select(mc => new MentorCertificationResponse
                    {
                        CertificationName = mc.CertificationName,
                        IssuingOrganization = mc.IssuingOrganization
                    }).ToList() ?? new List<MentorCertificationResponse>(),
                Status = mentorApplication?.ApplicationStatus.Name ?? string.Empty
            };
        }
    }
}