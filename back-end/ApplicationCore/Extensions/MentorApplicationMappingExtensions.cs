using ApplicationCore.DTOs.Requests.Certifications;
using ApplicationCore.DTOs.Requests.Educations;
using ApplicationCore.DTOs.Requests.WorkExperiences;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.Extensions
{
    public static class MentorApplicationMappingExtensions
    {
        public static MentorEducation ToMentorEducationEntity(this EducationDetailDto dto, Guid mentorApplicationId)
        {
            return new MentorEducation
            {
                Id = Guid.NewGuid(),
                MentorApplicationId = mentorApplicationId,
                InstitutionName = dto.InstitutionName.Trim(),
                FieldOfStudy = dto.FieldOfStudy.Trim(),
                GraduationYear = dto.GraduationYear
            };
        }

        public static List<MentorEducation> ToMentorEducationEntityList(this IEnumerable<EducationDetailDto> dtoList, Guid mentorApplicationId)
        {
            return dtoList.Select(dto => dto.ToMentorEducationEntity(mentorApplicationId)).ToList();
        }

        public static MentorWorkExperience ToMentorWorkExperienceEntity(this WorkExperienceDetailDto dto, Guid mentorApplicationId)
        {
            return new MentorWorkExperience
            {
                Id = Guid.NewGuid(),
                MentorApplicationId = mentorApplicationId,
                CompanyName = dto.CompanyName.Trim(),
                Position = dto.Position.Trim(),
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
            };
        }

        public static List<MentorWorkExperience> ToMentorWorkExperienceEntityList(this IEnumerable<WorkExperienceDetailDto> dtoList, Guid mentorApplicationId)
        {
            return dtoList.Select(dto => dto.ToMentorWorkExperienceEntity(mentorApplicationId)).ToList();
        }

        public static MentorCertification ToMentorCertificationEntity(this CertificationDetailDto dto, Guid mentorApplicationId)
        {
            return new MentorCertification
            {
                Id = Guid.NewGuid(),
                MentorApplicationId = mentorApplicationId,
                CertificationName = dto.CertificationName.Trim(),
                IssuingOrganization = dto.IssuingOrganization.Trim(),
            };
        }

        public static List<MentorCertification> ToMentorCertificationEntityList(this IEnumerable<CertificationDetailDto> dtoList, Guid mentorApplicationId)
        {
            return dtoList.Select(dto => dto.ToMentorCertificationEntity(mentorApplicationId)).ToList();
        }

        public static MentorApplicationResponseDto ToMentorApplicationResponseDto(
            this MentorApplication entity,
            User applicantUser,
            ApplicationStatus applicationStatus)
        {
            string submissionDateForResponse = entity.SubmissionDate;

            return new MentorApplicationResponseDto
            {
                Id = entity.ApplicantId,
                ApplicantUserId = entity.ApplicantId,
                ApplicantFullName = applicantUser.UserProfile.FullName,
                Status = applicationStatus.Name,
                SubmissionDate = submissionDateForResponse,
                CreatedAt = entity.CreatedAt,
                LastStatusUpdateDate = entity.LastStatusUpdateDate,
                EducationDetails = entity.MentorEducations.Select(e => e.ToEducationDetailDto()).ToList(),
                WorkExperienceDetails = entity.MentorWorkExperiences.Select(w => w.ToWorkExperienceDetailDto()).ToList(),
                Certifications = entity.MentorCertifications.Select(c => c.ToCertificationDetailDto()).ToList(),
            };
        }

        public static EducationDetailDto ToEducationDetailDto(this MentorEducation entity)
        {
            if (entity == null) return null!;

            return new EducationDetailDto
            {
                InstitutionName = entity.InstitutionName,
                FieldOfStudy = entity.FieldOfStudy,
                GraduationYear = entity.GraduationYear
            };
        }

        public static WorkExperienceDetailDto ToWorkExperienceDetailDto(this MentorWorkExperience entity)
        {
            if (entity == null) return null!;

            return new WorkExperienceDetailDto
            {
                CompanyName = entity.CompanyName,
                Position = entity.Position,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
            };
        }

        public static CertificationDetailDto ToCertificationDetailDto(this MentorCertification entity)
        {
            if (entity == null)
                return null!;

            return new CertificationDetailDto
            {
                CertificationName = entity.CertificationName,
                IssuingOrganization = entity.IssuingOrganization,
            };
        }
        public static DocumentDetailResponse ToDocumentDetailResponseDto(this DocumentContent entity)
        {
            if (entity == null)
                return null!;

            return new DocumentDetailResponse
            {
                Id = entity.Id,
                FileName = entity.FileName,
                FileType = entity.FileType,
                FileContent = entity.FileContent
            };
        }

        public static MentorApplicationDetailResponse ToMentorApplicationDetailResponse(
            this MentorApplication entity)
        {
            string submissionDateForResponse = entity.SubmissionDate;

            return new MentorApplicationDetailResponse
            {
                Id = entity.ApplicantId,
                ApplicantUserId = entity.ApplicantId,
                ApplicantFullName = entity.Applicant.UserProfile.FullName,
                Status = entity.ApplicationStatus.Name,
                SubmissionDate = submissionDateForResponse,
                CreatedAt = entity.CreatedAt,
                LastStatusUpdateDate = entity.LastStatusUpdateDate,
                RequestInfoDate = entity.RequestInfoDate,
                EducationDetails = entity.MentorEducations.Select(e => e.ToEducationDetailDto()).ToList(),
                WorkExperienceDetails = entity.MentorWorkExperiences.Select(w => w.ToWorkExperienceDetailDto()).ToList(),
                Certifications = entity.MentorCertifications.Select(c => c.ToCertificationDetailDto()).ToList(),
                DocumentsDetails = entity.SupportingDocuments.Select(s => s.DocumentContent.ToDocumentDetailResponseDto()).ToList()
            };
        }
    }
}
