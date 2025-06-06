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
            };
        }
    }
}