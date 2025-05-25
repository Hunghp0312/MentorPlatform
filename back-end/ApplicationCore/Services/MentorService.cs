using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Services;

namespace ApplicationCore.Services
{
    public class MentorService : IMentorService
    {
        private readonly IMentorRepository _mentorRepository;
        private readonly IDocumentContentRepository _documentContentRepository;
        private readonly ISupportingDocumentRepository _supportingDocumentRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISendEmailService _sendEmailService;
        private readonly IUnitOfWork _unitOfWork;

        public MentorService(IMentorRepository mentorRepository, IUnitOfWork unitOfWork, IDocumentContentRepository documentContentRepository, ISupportingDocumentRepository supportingDocumentRepository)
        {
            _mentorRepository = mentorRepository;
            _unitOfWork = unitOfWork;
            _documentContentRepository = documentContentRepository;
            _supportingDocumentRepository = supportingDocumentRepository;
        }

        public async Task<OperationResult<PagedResult<MetorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, int applicatioStatus, string? searchString = null)
        {
            var (mentors, totalCount) = await _mentorRepository.GetPagedAsync(
                filter: query => query
                    .Where(x => x.ApplicationStatus != null && x.ApplicationStatus.Id == applicatioStatus)
                    .Where(x => x.Applicant != null &&
                                x.Applicant.UserProfile != null &&
                                !string.IsNullOrEmpty(x.Applicant.UserProfile.FullName) &&
                                x.Applicant.UserProfile.FullName.Contains(searchString ?? string.Empty) ||
                                (x.Applicant != null && !string.IsNullOrEmpty(x.Applicant.Email) && x.Applicant.Email.Contains(searchString ?? string.Empty)))
                    .OrderByDescending(x => x.CreatedAt),
                pageIndex: paginationParameters.PageIndex,
                pageSize: paginationParameters.PageSize
            );
            var pagedResult = new PagedResult<MetorApplicantResponse>
            {
                TotalItems = totalCount,
                PageIndex = paginationParameters.PageIndex,
                PageSize = paginationParameters.PageSize,
                Items = mentors.ToMetorApplicantResponseList()
            };


            return OperationResult<PagedResult<MetorApplicantResponse>>.Ok(pagedResult);
        }
        public async Task<OperationResult<MentorApplicationResponseDto>> SubmitApplicationAsync(
          SubmitMentorApplicationApiRequest apiRequest
         // , Guid applicantUserId
         )
        {
            Guid applicantUserId = Guid.Parse("5c306965-7176-4cce-b192-4a21285794f3");
            var existingApplication = await _mentorRepository.GetByIdAsync(applicantUserId);
            if (existingApplication != null)
            {
                return OperationResult<MentorApplicationResponseDto>.BadRequest($"User already has an existing application with status: {existingApplication.ApplicationStatus.Name}.");
            }

            UploadedFileDetail processedFileDetail = null!;
            if (apiRequest.SupportingDocument.Length > 0)
            {
                var formFile = apiRequest.SupportingDocument;
                var memoryStream = new MemoryStream();
                await formFile.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                processedFileDetail = new UploadedFileDetail
                {
                    FileName = formFile.FileName,
                    ContentType = formFile.ContentType,
                    Length = formFile.Length,
                    ContentStream = memoryStream
                };
            }
            var mentorApplicationEntity = new MentorApplication
            {
                ApplicantId = applicantUserId,
                ApplicationStatusId = 1,
                SubmissionDate = DateTime.UtcNow.ToString(),
                CreatedAt = DateTime.UtcNow,
                LastStatusUpdateDate = DateTime.UtcNow
            };


            mentorApplicationEntity.MentorEducations = apiRequest.EducationDetails.ToMentorEducationEntityList(applicantUserId);
            mentorApplicationEntity.MentorWorkExperiences = apiRequest.WorkExperienceDetails.ToMentorWorkExperienceEntityList(applicantUserId);
            mentorApplicationEntity.MentorCertifications = apiRequest.Certifications.ToMentorCertificationEntityList(applicantUserId);

            await _mentorRepository.AddAsync(mentorApplicationEntity);

            byte[] fileBytes;
            using (var memoryStreamToRead = new MemoryStream())
            {
                await processedFileDetail.ContentStream.CopyToAsync(memoryStreamToRead);
                fileBytes = memoryStreamToRead.ToArray();
            }
            await processedFileDetail.ContentStream.DisposeAsync();

            var documentContentEntity = new DocumentContent
            {
                Id = Guid.NewGuid(),
                FileContent = fileBytes,
                FileName = processedFileDetail.FileName,
                FileType = processedFileDetail.ContentType
            };
            await _documentContentRepository.AddAsync(documentContentEntity);

            var supportingDocumentEntity = new SupportingDocument
            {
                Id = Guid.NewGuid(),
                MentorApplicationId = mentorApplicationEntity.ApplicantId,
                FileName = processedFileDetail.FileName,
                FileType = processedFileDetail.ContentType,
                FileSize = processedFileDetail.Length,
                UploadedAt = DateTime.UtcNow,
                DocumentContentId = documentContentEntity.Id
            };

            await _supportingDocumentRepository.AddAsync(supportingDocumentEntity);
            await _unitOfWork.SaveChangesAsync();

            var createdMentorApplication = await _mentorRepository.GetByIdAsync(mentorApplicationEntity.ApplicantId); MentorApplicationResponseDto responseDto = null!;
            if (createdMentorApplication != null)
            {
                responseDto = createdMentorApplication.ToMentorApplicationResponseDto(createdMentorApplication.Applicant, createdMentorApplication.ApplicationStatus);
            }

            return OperationResult<MentorApplicationResponseDto>.Ok(responseDto);
        }

        public async Task<OperationResult<MetorApplicantResponse>> UpdateMentorApplicationStatus(Guid mentorId, int statusId, string? adminComments = null)
        {
            var mentorApplication = await _mentorRepository.GetByIdAsync(mentorId);
            if (mentorApplication == null)
            {
                return OperationResult<MetorApplicantResponse>.NotFound("Mentor application not found");
            }

            mentorApplication.ApplicationStatusId = statusId;
            mentorApplication.AdminComments = adminComments;
            _mentorRepository.Update(mentorApplication);
            await _unitOfWork.SaveChangesAsync();

            var applicantName = mentorApplication.Applicant.UserProfile?.FullName ?? "Applicant";
            var platformName = "MentorPlatform"; // Replace with your platform name or fetch from config
            var applicationStatus = mentorApplication.ApplicationStatus?.Name ?? "Updated";
            var updateLink = "https://yourplatform.com/mentor/update"; // Replace with actual update link

            var emailSubject = "Mentor Application Status Update";

            string emailBody = $@"
                                Hi {applicantName},
                                Thank you for submitting your mentor application to {platformName}.
                                After reviewing your application, the status has been updated to:
                                {applicationStatus}
                                ";

            if (applicationStatus.Equals("Approved", StringComparison.OrdinalIgnoreCase))
            {
                emailBody += @"
                            We are excited to welcome you as a mentor on our platform! You will receive further
                            instructions soon on how to get started and set up your profile.
                            ";
            }
            else if (applicationStatus.Equals("Rejected", StringComparison.OrdinalIgnoreCase))
            {
                emailBody += @"
                            Unfortunately, your application has been rejected at this time.
                            ";
                if (!string.IsNullOrEmpty(adminComments))
                {
                    emailBody += $"\nReason: {adminComments}\n";
                }
                emailBody += @"
                            We encourage you to apply again in the future if circumstances change or you gain
                            additional relevant experience.
                            ";
            }
            else if (applicationStatus.Equals("Requested Info", StringComparison.OrdinalIgnoreCase))
            {
                emailBody += @"
                            Your application requires some additional information or clarification.
                            ";
                if (!string.IsNullOrEmpty(adminComments))
                {
                    emailBody += $"\nAdmin’s Note: {adminComments}\n";
                }
                emailBody += $@"
                                Please log in and update your application accordingly: {updateLink}
                                ";
            }

            emailBody += $@"
                        If you have any questions, feel free to reply to this email or reach out to our support team.

                        Best regards,
                        The {platformName} Team
                        ";
            var emailRecipient = mentorApplication.Applicant.Email;
            var result = mentorApplication.ToMetorApplicantResponse();
            await _sendEmailService.SendEmail(emailRecipient, emailSubject, emailBody);
            return OperationResult<MetorApplicantResponse>.Ok(result);

        }
    }
}