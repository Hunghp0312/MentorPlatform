using ApplicationCore.DTOs.Common;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Courses
{
    public class GetCourseDetailsResponse : BaseResponse
    {
        public required Guid CategoryId { get; set; }
        public required string CategoryName { get; set; }
        public CourseStatus? Status { get; set; }
        public required CourseLevel Level { get; set; }
        public required string Duration { get; set; }
        public DateTime Created { get; set; }
        public required List<string> Tags { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
