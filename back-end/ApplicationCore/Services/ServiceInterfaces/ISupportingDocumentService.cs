using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Microsoft.AspNetCore.Http;

namespace ApplicationCore.Services.ServiceInterfaces
{
  public interface ISupportingDocumentService
  {
    Task<OperationResult<SupportingDocumentResponse>> UploadFileAsync(
      IFormFile? file, Guid applicantId
  );
    Task<OperationResult<SupportingDocumentResponse>> DeleteFileAsync(
        Guid applicantId, Guid fileId
  );
    Task<OperationResult<DocumentDetailResponse>> GetFileDetails(Guid supportingDocumentId);
    Task<OperationResult<SupportingDocumentResponse>> UploadResourceFileAsync(IFormFile? file, Guid resourceId, Guid mentorId);
    Task<OperationResult<SupportingDocumentResponse>> DeleteResourceFileAsync(Guid mentorId, Guid fileId);
  }
}