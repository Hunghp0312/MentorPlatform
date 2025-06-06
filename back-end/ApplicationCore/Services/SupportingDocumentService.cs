using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;

namespace ApplicationCore.Services
{
    public class SupportingDocumentService : ISupportingDocumentService
    {
        private readonly IDocumentContentRepository _documentContentRepository;
        private readonly ISupportingDocumentRepository _supportingDocumentRepository;
        private readonly IMentorRepository _mentorRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IUnitOfWork _unitOfWork;
        public SupportingDocumentService(IDocumentContentRepository documentContentRepository,
        ISupportingDocumentRepository supportingDocumentRepository, IUnitOfWork unitOfWork,
        IMentorRepository mentorRepository, IResourceRepository resourceRepository)
        {
            _documentContentRepository = documentContentRepository;
            _supportingDocumentRepository = supportingDocumentRepository;
            _unitOfWork = unitOfWork;
            _mentorRepository = mentorRepository;
            _resourceRepository = resourceRepository;
        }

        public async Task<OperationResult<SupportingDocumentResponse>> UploadFileAsync(IFormFile? file, Guid applicantId)
        {
            var existingApplication = await _mentorRepository.GetByIdAsync(applicantId);
            if (existingApplication == null)
            {
                return OperationResult<SupportingDocumentResponse>.BadRequest("There is no application found for this user");
            }
            if (file == null)
            {
                return OperationResult<SupportingDocumentResponse>.NoContent();
            }

            int currentFileCount = existingApplication.SupportingDocuments.Count;
            if (currentFileCount >= FileUploadConstants.MaxAllowedFiles)
            {
                return OperationResult<SupportingDocumentResponse>.BadRequest(
                    ValidationMessages.MaxFilesExceeded.Replace("{MaxFiles}", FileUploadConstants.MaxAllowedFiles.ToString())
                );
            }

            UploadedFileDetail processedFileDetail = null!;
            if (file.Length > 0)
            {
                var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                processedFileDetail = new UploadedFileDetail
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Length = file.Length,
                    ContentStream = memoryStream
                };
            }

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
                MentorApplicationId = existingApplication.ApplicantId,
                FileName = processedFileDetail.FileName,
                FileType = processedFileDetail.ContentType,
                FileSize = processedFileDetail.Length,
                UploadedAt = DateTime.UtcNow,
                DocumentContentId = documentContentEntity.Id
            };

            await _supportingDocumentRepository.AddAsync(supportingDocumentEntity);
            await _unitOfWork.SaveChangesAsync();
            var response = supportingDocumentEntity.ToSupportingDocumentResponse();

            return OperationResult<SupportingDocumentResponse>.Created(response);
        }


        public async Task<OperationResult<SupportingDocumentResponse>> DeleteFileAsync(Guid applicantId, Guid fileId)
        {
            var existingApplication = await _mentorRepository.GetByIdAsync(applicantId);
            if (existingApplication == null)
            {
                return OperationResult<SupportingDocumentResponse>.NotFound("There is no application found for this user");
            }
            if (fileId == Guid.Empty)
            {
                return OperationResult<SupportingDocumentResponse>.BadRequest("File id can not be empty");
            }

            var existingFile = await _documentContentRepository.GetByIdAsync(fileId);
            if (existingFile == null)
            {
                return OperationResult<SupportingDocumentResponse>.NotFound("File is not found");
            }

            await _documentContentRepository.DeleteById(fileId);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<SupportingDocumentResponse>.NoContent();
        }


        public async Task<OperationResult<DocumentDetailResponse>> GetFileDetails(Guid supportingDocumentId)
        {
            var document = await _supportingDocumentRepository.GetSupportingDocumentWithContentAsync(supportingDocumentId);
            if (document == null || document.DocumentContent == null)
            {
                return OperationResult<DocumentDetailResponse>.BadRequest("Document not found or has no content.");
            }

            return OperationResult<DocumentDetailResponse>.Ok(document.DocumentContent.ToDocumentDetailResponse());
        }

        public async Task<OperationResult<SupportingDocumentResponse>> UploadResourceFileAsync(IFormFile? file, Guid resourceId, Guid mentorId)
        {
            var existingResource = await _resourceRepository.GetByIdAsync(resourceId);
            if (existingResource == null)
            {
                return OperationResult<SupportingDocumentResponse>.BadRequest("There is no resource with that Id found for this user");
            }
            if (mentorId != existingResource?.Course!.MentorId)
            {
                return OperationResult<SupportingDocumentResponse>.NotFound("You are not authorized to upload file to this resource, cause you are not the mentor of this course.");
            }
            if (file == null)
            {
                return OperationResult<SupportingDocumentResponse>.NoContent();
            }
            UploadedFileDetail processedFileDetail = null!;
            if (file.Length > 0)
            {
                var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                processedFileDetail = new UploadedFileDetail
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Length = file.Length,
                    ContentStream = memoryStream
                };
            }

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
                FileName = processedFileDetail.FileName,
                FileType = processedFileDetail.ContentType,
                FileSize = processedFileDetail.Length,
                //ResourceId = resourceId,
                UploadedAt = DateTime.UtcNow,
                DocumentContentId = documentContentEntity.Id
            };

            await _supportingDocumentRepository.AddAsync(supportingDocumentEntity);
            await _unitOfWork.SaveChangesAsync();
            var response = supportingDocumentEntity.ToSupportingDocumentResponse();

            return OperationResult<SupportingDocumentResponse>.Created(response);
        }

        public async Task<OperationResult<SupportingDocumentResponse>> DeleteResourceFileAsync(Guid mentorId, Guid fileId)
        {

            var supportingDocument = await _supportingDocumentRepository.GetSupportingDocumentWithContentAsync(fileId);
            if (supportingDocument == null)
            {
                return OperationResult<SupportingDocumentResponse>.NotFound("File not found.");
            }

            //if (!supportingDocument.ResourceId.HasValue)
            //{
            //    return OperationResult<SupportingDocumentResponse>.BadRequest("This file is not associated with a resource.");
            //}

            //var resource = await _resourceRepository.GetByIdAsync(supportingDocument.ResourceId.Value);
            //if (resource == null || resource.Course?.MentorId != mentorId)
            //{
            //    return OperationResult<SupportingDocumentResponse>.BadRequest("You are not authorized to delete this resource file or the resource does not exist.");
            //}

            //await _supportingDocumentRepository.DeleteById(fileId);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<SupportingDocumentResponse>.NoContent();
        }
    }
}
