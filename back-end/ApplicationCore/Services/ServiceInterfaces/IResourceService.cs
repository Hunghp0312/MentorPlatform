using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Resources;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.DTOs.Responses.SupportingDocuments;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IResourceService
    {
        Task<OperationResult<PagedResult<ResourceResponse>>> GetAllResources(ResourceQueryParameters resourceQueryParameters, Guid UserId);
        Task<OperationResult<ResourceResponse>> EditResource(Guid resourceId, Guid MentorId);
        Task<OperationResult<ResourceResponse>> DeleteResource(Guid resourceId, Guid UserId);
        Task<OperationResult<ResourceResponse>> AddResource(Guid mentorId, AddResourceRequest request);
        Task<OperationResult<SupportingDocumentResponse>> GetFileDetails(Guid FileId);
        Task DownloadFile(Guid FileId);

    }
}