using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Infrastructure.Services;
using System.Text;

namespace ApplicationCore.Services
{
    public class MentorService : IMentorService
    {
        private readonly IMentorRepository _mentorRepository;
        private readonly IMentorEducationRepository _mentorEducationRepository;
        private readonly IMentorWorkExperienceRepository _mentorWorkExperienceRepository;
        private readonly IMentorCertificationRepository _mentorCertificationRepository;
        private readonly IUserProfileRepository _userProfileRepository;

        private readonly IUnitOfWork _unitOfWork;
        private readonly ISendEmailService _sendEmailService;

        public MentorService(IMentorRepository mentorRepository, IUnitOfWork unitOfWork, IMentorEducationRepository mentorEducationRepository, IMentorWorkExperienceRepository mentorWorkExperienceRepository, IMentorCertificationRepository mentorCertificationRepository, ISendEmailService sendEmailService, IUserProfileRepository userProfileRepository)
        {
            _sendEmailService = sendEmailService;
            _mentorRepository = mentorRepository;
            _unitOfWork = unitOfWork;
            _mentorEducationRepository = mentorEducationRepository;
            _mentorWorkExperienceRepository = mentorWorkExperienceRepository;
            _mentorCertificationRepository = mentorCertificationRepository;
            _userProfileRepository = userProfileRepository;
        }

        public async Task<OperationResult<PagedResult<MentorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, int applicationStatus)
        {
            var filter = (IQueryable<MentorApplication> query) =>
            {
                if (applicationStatus != 0)
                {
                    if (applicationStatus == 1 || applicationStatus == 5 || applicationStatus == 6)
                    {
                        query = query.Where(x => x.ApplicationStatus != null && (x.ApplicationStatus.Id == 1 || x.ApplicationStatus.Id == 5 || x.ApplicationStatus.Id == 6));
                    }
                    else
                    {
                        query = query.Where(x => x.ApplicationStatus != null && x.ApplicationStatus.Id == applicationStatus);
                    }
                }

                if (!string.IsNullOrEmpty(paginationParameters.Query))
                {
                    query = query.Where(x =>
                        (x.Applicant != null &&
                        x.Applicant.UserProfile != null &&
                        !string.IsNullOrEmpty(x.Applicant.UserProfile.FullName) &&
                        x.Applicant.UserProfile.FullName.Contains(paginationParameters.Query)) ||
                        (x.Applicant != null &&
                        !string.IsNullOrEmpty(x.Applicant.Email) &&
                        x.Applicant.Email.Contains(paginationParameters.Query))
                    );
                }

                return query.OrderByDescending(x => x.CreatedAt);
            };

            var (mentors, totalCount) = await _mentorRepository.GetPagedAsync(
                filter: filter,
                pageIndex: paginationParameters.PageIndex,
                pageSize: paginationParameters.PageSize
            );

            var pagedResult = new PagedResult<MentorApplicantResponse>
            {
                TotalItems = totalCount,
                PageIndex = paginationParameters.PageIndex,
                PageSize = paginationParameters.PageSize,
                Items = mentors.ToMetorApplicantResponseList()
            };

            return OperationResult<PagedResult<MentorApplicantResponse>>.Ok(pagedResult);
        }
        public async Task<OperationResult<MentorApplicationResponseDto>> SubmitApplicationAsync(
          SubmitMentorApplicationApiRequest apiRequest
          , Guid applicantUserId
         )
        {
            var existingApplication = await _mentorRepository.GetByIdAsync(applicantUserId);
            if (existingApplication != null)
            {
                return OperationResult<MentorApplicationResponseDto>.BadRequest($"User already has an existing application with status: {existingApplication.ApplicationStatus.Name}.");
            }

            var mentorApplicationEntity = new MentorApplication
            {
                ApplicantId = applicantUserId,
                ApplicationStatusId = 5,
                SubmissionDate = DateTime.UtcNow.ToString(),
                CreatedAt = DateTime.UtcNow,
                LastStatusUpdateDate = DateTime.UtcNow
            };

            mentorApplicationEntity.MentorEducations = apiRequest.EducationDetails.ToMentorEducationEntityList(applicantUserId);
            mentorApplicationEntity.MentorWorkExperiences = apiRequest.WorkExperienceDetails.ToMentorWorkExperienceEntityList(applicantUserId);
            mentorApplicationEntity.MentorCertifications = apiRequest.Certifications.ToMentorCertificationEntityList(applicantUserId);

            await _mentorRepository.AddAsync(mentorApplicationEntity);
            await _unitOfWork.SaveChangesAsync();

            var createdMentorApplication = await _mentorRepository.GetByIdAsync(mentorApplicationEntity.ApplicantId); MentorApplicationResponseDto responseDto = null!;
            if (createdMentorApplication != null)
            {
                responseDto = createdMentorApplication.ToMentorApplicationResponseDto(createdMentorApplication.Applicant, createdMentorApplication.ApplicationStatus);
            }

            return OperationResult<MentorApplicationResponseDto>.Ok(responseDto);
        }

        public async Task<OperationResult<MentorApplicantResponse>> UpdateMentorApplicationStatus(MentorUpdateStatusRequest request, Guid adminUserId)
        {
            if (request.MentorId == Guid.Empty)
            {
                return OperationResult<MentorApplicantResponse>.BadRequest("Mentor ID cannot be empty");
            }

            var mentorApplication = await _mentorRepository.GetByIdAsync(request.MentorId);
            if (mentorApplication == null)
            {
                return OperationResult<MentorApplicantResponse>.NotFound("Mentor application not found");
            }

            var validationResult = ValidateStatusChange(mentorApplication, request);
            if (validationResult != null)
            {
                return validationResult;
            }

            UpdateMentorApplicationStatusFields(mentorApplication, request, adminUserId);

            _mentorRepository.Update(mentorApplication);
            await _unitOfWork.SaveChangesAsync();

            mentorApplication = await _mentorRepository.GetByIdAsync(request.MentorId);
            if (mentorApplication == null)
            {
                return OperationResult<MentorApplicantResponse>.NotFound("Mentor application not found after update");
            }
            await SendStatusUpdateEmailIfNeeded(mentorApplication, request);


            var result = mentorApplication.ToMetorApplicantResponse();

            return OperationResult<MentorApplicantResponse>.Ok(result);
        }

        private static OperationResult<MentorApplicantResponse>? ValidateStatusChange(MentorApplication mentorApplication, MentorUpdateStatusRequest request)
        {
            if (request.StatusId <= 0)
            {
                return OperationResult<MentorApplicantResponse>.BadRequest("Invalid status ID provided.");
            }
            if (mentorApplication.ApplicationStatusId == request.StatusId)
            {
                return OperationResult<MentorApplicantResponse>.BadRequest("The application is already in the requested status.");
            }
            if (mentorApplication.ApplicationStatusId == 2 || mentorApplication.ApplicationStatusId == 3)
            {
                return OperationResult<MentorApplicantResponse>.BadRequest("Cannot change status from Approved and Reject to any other status ");
            }
            return null;
        }

        private static void UpdateMentorApplicationStatusFields(MentorApplication mentorApplication, MentorUpdateStatusRequest request, Guid adminUserId)
        {
            mentorApplication.ApplicationStatusId = request.StatusId;
            mentorApplication.LastStatusUpdateDate = DateTime.UtcNow;
            mentorApplication.AdminReviewerId = adminUserId;
            if (request.StatusId == 2)
            {
                mentorApplication.ApprovalDate = DateTime.UtcNow;
                mentorApplication.RejectionReason = request.AdminComments;
            }
            if (request.StatusId == 3)
            {
                mentorApplication.ApprovalDate = DateTime.UtcNow;
                mentorApplication.AdminComments = request.AdminComments;
                mentorApplication.Applicant.StatusId = 1;
            }
            if (request.StatusId == 4)
            {
                mentorApplication.AdminComments = request.AdminComments;
                if (!string.IsNullOrEmpty(mentorApplication.RequestInfoDate))
                {
                    mentorApplication.RequestInfoDate = mentorApplication.RequestInfoDate + ", " + DateTime.UtcNow.ToString();
                }
                else
                {
                    mentorApplication.RequestInfoDate = DateTime.UtcNow.ToString();
                }
            }
        }

        private async Task SendStatusUpdateEmailIfNeeded(MentorApplication mentorApplication, MentorUpdateStatusRequest request)
        {
            var applicantName = mentorApplication.Applicant.UserProfile?.FullName ?? "Applicant";
            var platformName = "MentorPlatform";
            var applicationStatus = mentorApplication.ApplicationStatus?.Name ?? "Updated";
            var emailSubject = "Mentor Application Status Update";

            if (applicationStatus.Equals("Approved", StringComparison.OrdinalIgnoreCase) ||
                applicationStatus.Equals("Rejected", StringComparison.OrdinalIgnoreCase) || applicationStatus.Equals("Request Info", StringComparison.OrdinalIgnoreCase))
            {
                var bodyBuilder = new StringBuilder();
                bodyBuilder.AppendLine($"Hi {applicantName},");
                bodyBuilder.AppendLine($"Thank you for submitting your mentor application to {platformName}.");
                bodyBuilder.AppendLine($"After reviewing your application, the status has been updated to: {applicationStatus}");
                bodyBuilder.AppendLine();

                switch (applicationStatus.ToLowerInvariant())
                {
                    case "approved":
                        bodyBuilder.AppendLine("We are excited to welcome you as a mentor on our platform! You will receive further instructions soon on how to get started and set up your profile.");
                        break;
                    case "rejected":
                        bodyBuilder.AppendLine("Unfortunately, your application has been rejected at this time.");
                        if (!string.IsNullOrWhiteSpace(request.AdminComments))
                        {
                            bodyBuilder.AppendLine($"Reason: {request.AdminComments}");
                        }
                        bodyBuilder.AppendLine("We encourage you to apply again in the future if circumstances change or you gain additional relevant experience.");
                        break;
                    case "request info":
                        bodyBuilder.AppendLine("We need more information to process your application. Please check your email for further instructions.");
                        break;
                }

                bodyBuilder.AppendLine();
                bodyBuilder.AppendLine("If you have any questions, feel free to reply to this email or reach out to our support team.");
                bodyBuilder.AppendLine();
                bodyBuilder.AppendLine($"Best regards,\nThe {platformName} Team");

                var emailBody = bodyBuilder.ToString();
                var emailRecipient = mentorApplication.Applicant.Email;
                await _sendEmailService.SendEmail(emailRecipient, emailSubject, emailBody);
            }
        }

        public async Task<OperationResult<MentorApplicationResponseDto>> UpdateMyApplicationAsync(
         UpdateMyApplicationApiRequest apiRequest, Guid applicantUserId)
        {
            var existingApplication = await _mentorRepository.GetByIdAsync(applicantUserId);
            if (existingApplication == null)
            {
                return OperationResult<MentorApplicationResponseDto>.NotFound($"No mentor application found for: ID '{applicantUserId}'.");
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();
                if (!existingApplication.ApplicationStatus.Name.Equals("Request Info"))
                {
                    return OperationResult<MentorApplicationResponseDto>.BadRequest($"Application in '{existingApplication.ApplicationStatus.Name}' status cannot be updated by the applicant.");
                }
                if (apiRequest.EducationDetails != null)
                {
                    _mentorEducationRepository.DeleteRange(existingApplication.MentorEducations);
                    existingApplication.MentorEducations.Clear();
                    var newEducations = apiRequest.EducationDetails.ToMentorEducationEntityList(existingApplication.ApplicantId);
                    await _mentorEducationRepository.AddRangeAsync(newEducations);
                }
                if (apiRequest.WorkExperienceDetails != null)
                {
                    _mentorWorkExperienceRepository.DeleteRange(existingApplication.MentorWorkExperiences);
                    existingApplication.MentorWorkExperiences.Clear();
                    var newWorkExperiences = apiRequest.WorkExperienceDetails.ToMentorWorkExperienceEntityList(applicantUserId);
                    await _mentorWorkExperienceRepository.AddRangeAsync(newWorkExperiences);
                }

                if (apiRequest.Certifications != null)
                {
                    _mentorCertificationRepository.DeleteRange(existingApplication.MentorCertifications);
                    existingApplication.MentorCertifications.Clear();
                    var newMentorCertifications = apiRequest.Certifications.ToMentorCertificationEntityList(applicantUserId);
                    await _mentorCertificationRepository.AddRangeAsync(newMentorCertifications);
                }
                existingApplication.LastStatusUpdateDate = DateTime.UtcNow;
                existingApplication.UpdatedAt = DateTime.UtcNow;
                existingApplication.ApplicationStatusId = 5;
                existingApplication.SubmissionDate += $", {DateTime.UtcNow}";

                _mentorRepository.Update(existingApplication);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitAsync();
            }
            catch (Exception e)
            {
                await _unitOfWork.RollbackAsync();

                return OperationResult<MentorApplicationResponseDto>.Fail($"An unexpected error occurred: {e.Message}");
            }

            var updatedMentorApplication = await _mentorRepository.GetByIdAsync(existingApplication.ApplicantId); MentorApplicationResponseDto responseDto = null!;
            if (updatedMentorApplication != null)
            {
                responseDto = updatedMentorApplication.ToMentorApplicationResponseDto(updatedMentorApplication.Applicant, updatedMentorApplication.ApplicationStatus);
            }

            return OperationResult<MentorApplicationResponseDto>.Ok(responseDto);
        }

        public async Task<OperationResult<MentorApplicationDetailResponse>> GetMyApplicationDetailAsync(Guid applicantUserId)
        {
            var mentorApplicationEntity = await _mentorRepository.GetDetailByIdAsync(applicantUserId);
            if (mentorApplicationEntity == null)
            {
                return OperationResult<MentorApplicationDetailResponse>.NotFound($"No mentor application found for user ID '{applicantUserId}'.");
            }
            var responseDto = mentorApplicationEntity.ToMentorApplicationDetailResponse();

            return OperationResult<MentorApplicationDetailResponse>.Ok(responseDto);

        }

        public async Task<OperationResult<MentorApplicationDetailDto>> GettMentoApplicationDetailAsync(Guid mentorApplicationId)
        {
            var mentorApplicationEntity = await _mentorRepository.GetByIdAsync(mentorApplicationId);
            if (mentorApplicationEntity == null)
            {
                return OperationResult<MentorApplicationDetailDto>.NotFound($"No mentor application found for ID '{mentorApplicationId}'.");
            }
            var responseDto = mentorApplicationEntity.ToMentorApplicationDetailDto();
            return OperationResult<MentorApplicationDetailDto>.Ok(responseDto);
        }

        public async Task<OperationResult<PagedResult<MentorCardDto>>> GetAvailableMentorsAsync(AvailableMentorQueryParameters queryParameters)
        {
            Func<IQueryable<UserProfile>, IQueryable<UserProfile>> filter = query =>
            {
                query = query.Where(up => up.User.RoleId == 3);
                if (queryParameters.ExpertiseId != 0)
                {
                    query = query.Where(up =>
                        up.User.UserAreaOfExpertises.Any(uae => queryParameters.ExpertiseId.Equals(uae.AreaOfExpertiseId))
                    );
                }

                if (!string.IsNullOrWhiteSpace(queryParameters.Query))
                {
                    string searchTerm = queryParameters.Query.ToLower().Trim();
                    query = query.Where(up =>
                        up.FullName.ToLower().Contains(searchTerm)
                    );
                }

                return query;
            };

            var (userProfiles, totalItems) = await _userProfileRepository.GetPagedAsync(
                filter,
                queryParameters.PageIndex,
                queryParameters.PageSize
            );

            var pagedResult = new PagedResult<MentorCardDto>
            {
                TotalItems = totalItems,
                PageIndex = queryParameters.PageIndex,
                PageSize = queryParameters.PageSize,
                Items = userProfiles.ToMentorCardDtoList()
            };

            return OperationResult<PagedResult<MentorCardDto>>.Ok(pagedResult);
        }

    }
}