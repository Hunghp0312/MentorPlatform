using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Categories;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Courses
{
    public class GetCourseDetailsResponse : BaseResponse
    {
        public required Guid CategoryId { get; set; }
        public required CourseCategoryResponse Category { get; set; }
        public required CourseStatus Status { get; set; }
        public required CourseLevel Level { get; set; }
        public required string Duration { get; set; }
        public DateTime Created { get; set; }
        public required List<string> Tags { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
