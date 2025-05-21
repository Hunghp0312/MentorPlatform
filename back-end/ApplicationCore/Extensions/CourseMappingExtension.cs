using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class CourseMappingExtension
    {
        public static GetCourseDetailsResponse CourseDetailResponseMap(this Course course)
        {
            return new GetCourseDetailsResponse
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Category = course.Category!.ToCourseCategory(),
                Status = course.Status!,
                Level = course.Level!,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated,
                Tags = TagHelper.ConvertStringToList(course.Tags),
            };
        }

        public static Course ToCourseEntity(this CreateUpdateCourseRequest createRequest)
        {
            return new Course
            {
                Id = Guid.NewGuid(),
                Name = createRequest.Name,
                Description = createRequest.Description,
                CategoryId = createRequest.CategoryId,
                StatusId = createRequest.StatusId,
                LevelId = createRequest.LevelId,
                Duration = createRequest.Duration,
                Created = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                Tags = TagHelper.ConvertListToString(createRequest.Tags),
            };
        }
    }
}
