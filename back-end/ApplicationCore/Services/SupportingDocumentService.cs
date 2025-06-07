using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.DocumentContents;
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
        private readonly IUnitOfWork _unitOfWork;
        public SupportingDocumentService(IDocumentContentRepository documentContentRepository,
        ISupportingDocumentRepository supportingDocumentRepository, IUnitOfWork unitOfWork,
        IMentorRepository mentorRepository)
        {
            _documentContentRepository = documentContentRepository;
            _supportingDocumentRepository = supportingDocumentRepository;
            _unitOfWork = unitOfWork;
            _mentorRepository = mentorRepository;
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
    }
}
