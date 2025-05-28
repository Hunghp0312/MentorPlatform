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
    }
}