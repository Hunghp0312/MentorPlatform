using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services
{
    public class MentorService : IMentorService
    {
        private readonly IMentorRepository _mentorRepository;
        private readonly IDocumentContentRepository _documentContentRepository;
        private readonly ISupportingDocumentRepository _supportingDocumentRepository;
        private readonly IMentorEducationRepository _mentorEducationRepository;
        private readonly IMentorWorkExperienceRepository _mentorWorkExperienceRepository;
        private readonly IMentorCertificationRepository _mentorCertificationRepository;

        private readonly IUnitOfWork _unitOfWork;

        public MentorService(IMentorRepository mentorRepository, IUnitOfWork unitOfWork, IDocumentContentRepository documentContentRepository, ISupportingDocumentRepository supportingDocumentRepository, IMentorEducationRepository mentorEducationRepository, IMentorWorkExperienceRepository mentorWorkExperienceRepository, IMentorCertificationRepository mentorCertificationRepository)
        {
            _mentorRepository = mentorRepository;
            _unitOfWork = unitOfWork;
            _documentContentRepository = documentContentRepository;
            _supportingDocumentRepository = supportingDocumentRepository;
            _mentorEducationRepository = mentorEducationRepository;
            _mentorWorkExperienceRepository = mentorWorkExperienceRepository;
            _mentorCertificationRepository = mentorCertificationRepository;
        }

        public async Task<OperationResult<PagedResult<MetorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, string applicatioStatus)
        {
            var (mentors, totalCount) = await _mentorRepository.GetPagedAsync(
                filter: query => query.Where(x => x.ApplicationStatus.Name == applicatioStatus),
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
          , Guid applicantUserId
         )
        {
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


        public async Task<OperationResult<MentorApplicationResponseDto>> UpdateMyApplicationAsync(
         UpdateMyApplicationApiRequest apiRequest, Guid applicantUserId)
        {
            var existingApplication = await _mentorRepository.GetByIdAsync(applicantUserId);
            if (existingApplication == null)
            {
                return OperationResult<MentorApplicationResponseDto>.NotFound($"No mentor application found for usermessage:  ID '{applicantUserId}'.");
            }

            if (!existingApplication.ApplicationStatus.Name.Equals("RequestInfo"))
            {
                return OperationResult<MentorApplicationResponseDto>.BadRequest($"Application in '{existingApplication.ApplicationStatus.Name}' status cannot be updated by the applicant.");
            }
            if (apiRequest.EducationDetails != null)
            {
                _mentorEducationRepository.DeleteRange(existingApplication.MentorEducations);
                existingApplication.MentorEducations.Clear();
                //existingApplication.MentorEducations = apiRequest.EducationDetails.ToMentorEducationEntityList(applicantUserId);
                //await _unitOfWork.SaveChangesAsync();

                //var newEducations = apiRequest.EducationDetails.ToMentorEducationEntityList(existingApplication.ApplicantId);
                //await _mentorEducationRepository.AddRangeAsync(newEducations);
                //await _unitOfWork.SaveChangesAsync();
            }
            if (apiRequest.WorkExperienceDetails != null)
            {
                _mentorWorkExperienceRepository.DeleteRange(existingApplication.MentorWorkExperiences);
                await _unitOfWork.SaveChangesAsync();
                existingApplication.MentorWorkExperiences.Clear();
                existingApplication.MentorWorkExperiences = apiRequest.WorkExperienceDetails.ToMentorWorkExperienceEntityList(applicantUserId);
                await _unitOfWork.SaveChangesAsync();
            }

            if (apiRequest.Certifications != null)
            {
                _mentorCertificationRepository.DeleteRange(existingApplication.MentorCertifications);
                await _unitOfWork.SaveChangesAsync();
                existingApplication.MentorCertifications.Clear();
                existingApplication.MentorCertifications = apiRequest.Certifications.ToMentorCertificationEntityList(applicantUserId);
                await _unitOfWork.SaveChangesAsync();
            }


            if (apiRequest.SupportingDocument != null && apiRequest.SupportingDocument.Length > 0)
            {
                var formFile = apiRequest.SupportingDocument;
                var memoryStream = new MemoryStream();
                await formFile.CopyToAsync(memoryStream);
                memoryStream.Position = 0;
                var processedFileDetail = new UploadedFileDetail
                {
                    FileName = formFile.FileName,
                    ContentType = formFile.ContentType,
                    Length = formFile.Length,
                    ContentStream = memoryStream
                };
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

                var newSupportingDocument = new SupportingDocument
                {
                    Id = Guid.NewGuid(),
                    MentorApplicationId = existingApplication.ApplicantId,
                    FileName = processedFileDetail.FileName,
                    FileType = processedFileDetail.ContentType,
                    FileSize = processedFileDetail.Length,
                    UploadedAt = DateTime.UtcNow,
                    DocumentContentId = documentContentEntity.Id
                };
                existingApplication.SupportingDocuments.Add(newSupportingDocument);
            }

            existingApplication.LastStatusUpdateDate = DateTime.UtcNow;
            existingApplication.UpdatedAt = DateTime.UtcNow;
            existingApplication.ApplicationStatusId = 4;

            _mentorRepository.Update(existingApplication);
            await _unitOfWork.SaveChangesAsync();

            var updatedMentorApplication = await _mentorRepository.GetByIdAsync(existingApplication.ApplicantId); MentorApplicationResponseDto responseDto = null!;
            if (updatedMentorApplication != null)
            {
                responseDto = updatedMentorApplication.ToMentorApplicationResponseDto(updatedMentorApplication.Applicant, updatedMentorApplication.ApplicationStatus);
            }

            return OperationResult<MentorApplicationResponseDto>.Ok(responseDto);
        }
    }
}