using ApplicationCore.Common;
using ApplicationCore.DTOs.Course;
using ApplicationCore.Entity;

namespace ApplicationCore.Extensions
{
    public static class CourseMappingExtension
    {
        public static GetCourseDetailsResponse CourseDetailResponseMap(this Course course)
        {
            return new GetCourseDetailsResponse
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                CategoryName = course.Category.Name,
                Status = course.Status,
                Level = course.Level,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated,
                Tags = TagHelper.ConvertStringToList(course.Tags),
            };
        }

        public static ListCourseResponse CourseListResponseMap(this Course course)
        {
            return new ListCourseResponse
            {
                Id = course.Id,
                Title = course.Title,
                CategoryName = course.Category!.Name,
                Status = course.Status,
                Level = course.Level,
                Duration = course.Duration,
                Tags = TagHelper.ConvertStringToList(course.Tags),
            };
        }

        public static Course ToCourseEntity(this CreateCourseRequest createRequest)
        {
            return new Course
            {
                Id = Guid.NewGuid(),
                Title = createRequest.Title,
                Description = createRequest.Description,
                CategoryId = createRequest.CategoryId,
                MentorId = createRequest.MentorId,
                Status = createRequest.Status,
                Level = createRequest.Level,
                Duration = createRequest.Duration,
                Created = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                Tags = TagHelper.ConvertListToString(createRequest.Tags),
            };
        }
    }
}
