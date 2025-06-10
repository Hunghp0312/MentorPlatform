using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Resources;
using ApplicationCore.DTOs.Responses.DocumentContents;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Microsoft.AspNetCore.Http;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IResourceService
    {
        Task<OperationResult<PagedResult<ResourceResponeGetAllService>>> GetAllResources(ResourceQueryParameters resourceQueryParameters, Guid UserId);
        Task<OperationResult<ResourceResponse>> EditResource(Guid resourceId, Guid mentorId, EditResourceRequest request);
        Task<OperationResult<ResourceResponse>> DeleteResource(Guid resourceId, Guid UserId);
        Task<OperationResult<ResourceResponse>> AddResource(Guid mentorId, AddResourceRequest request);
        Task<OperationResult<UpdateResourceUrlResponse>> UpdateResourceUrl(Guid resourceId, Guid userId, string url);
        Task<OperationResult<ResourceFileResponse>> UploadResourceFileAsync(IFormFile? file, Guid resourceId, Guid mentorId);
        Task<OperationResult<DocumentDetailResponse>> GetFileResourceDetails(Guid fileId, Guid userId);
    }
}