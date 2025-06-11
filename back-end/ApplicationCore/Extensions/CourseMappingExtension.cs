using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class CourseMappingExtension
    {
        public static GetCourseDetailsResponse CourseDetailResponseMap(this Course course, Guid? learnerId = null)
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
                StudentCount = course.StudentCount,
                Completion = course.Completion,
                Resources = course.Resources.Select(r => r.ToResourceResponse()).ToList(),
                IsEnroll = learnerId != null && course.LearnerCourses.Any(lc => lc.LearnerId == learnerId),
                IsCompleted = learnerId != null && course.LearnerCourses.Any(lc => lc.LearnerId == learnerId && lc.IsCompleted),
            };
        }
        public static CourseDetailResponse ToCourseDetailResponse(this Course course, Guid? learnerId = null)
        {
            return new CourseDetailResponse
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
                StudentCount = course.StudentCount,
                Completion = course.Completion,
                Resources = course.Resources.Select(r => r.ToResourceResponeGetAllService()).ToList(),
                IsEnroll = learnerId != null && course.LearnerCourses.Any(lc => lc.LearnerId == learnerId),
                IsCompleted = learnerId != null && course.LearnerCourses.Any(lc => lc.LearnerId == learnerId && lc.IsCompleted),
                Mentor = course.Mentor?.ToUserResponseDto(),
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
