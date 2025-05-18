using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.Entity;

namespace ApplicationCore.Extensions
{
    public static class CourseMappingExtension
    {
        public static CourseDetailsResponse CourseDetailResponseMap(this Course course)
        {
            var courseDetailsResponse = new CourseDetailsResponse
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
            return courseDetailsResponse;
        }

        public static CourseListResponse CourseListResponseMap(Course course)
        {
            var courseListResponse = new CourseListResponse
            {
                Id = course.Id,
                Title = course.Title,
                CategoryName = course.Category.Name,
                Status = course.Status,
                Difficulty = course.Level,
                Duration = course.Duration,
                Tags = TagHelper.ConvertStringToList(course.Tags),
            };

            return courseListResponse;
        }
    }
}
