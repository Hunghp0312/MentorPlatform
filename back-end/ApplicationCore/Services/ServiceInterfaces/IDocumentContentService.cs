
using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.Resources;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IDocumentContentService
    {
        Task<OperationResult<FileDownloadDto>> DownloadResourceFileAsync(Guid fileId, Guid userId);
    }
}
