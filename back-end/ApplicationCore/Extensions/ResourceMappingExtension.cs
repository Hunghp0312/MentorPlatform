using ApplicationCore.DTOs.Responses.Resources;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class ResourceMappingExtension
    {
        public static ResourceResponse ToResourceResponse(this Resource resource)
        {
            return new ResourceResponse
            {
                ResourceId = resource.Id,
                Title = resource.Title,
                Description = resource.Description,
                CourseId = resource.CourseId,
                CourseName = resource.Course!.Name,
                TypeOfResource = resource.TypeOfResource!,
                ResourceCategory = resource.ResourceCategory!,
            };
        }

        public static ResourceResponeGetAllService ToResourceResponeGetAllService(this Resource resource)
        {
            return new ResourceResponeGetAllService
            {
                ResourceId = resource.Id,
                Title = resource.Title,
                Description = resource.Description,
                CourseId = resource.CourseId,
                CourseName = resource.Course!.Name,
                TypeOfResource = resource.TypeOfResource!,
                ResourceCategory = resource.ResourceCategory!,
                FileId = resource.DocumentContentId,
                FileName = resource.DocumentContent?.FileName ?? string.Empty,
                FileType = resource.DocumentContent?.FileType ?? string.Empty,
                link = resource.Url
            };
        }
        public static ResourceLinkResponse ToResourceLinkResponse(this Resource resource)
        {
            return new ResourceLinkResponse
            {
                Url = resource?.Url ?? string.Empty
            };
        }
    }
}