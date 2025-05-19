using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.Course
{
    public class ListCourseResponse : BaseResponse
    {
        public required Guid CategoryId { get; set; }
        public required string CategoryName { get; set; }
        public CourseStatus Status { get; set; }
        public required CourseLevel Level { get; set; }
        public required string Duration { get; set; }
        public required List<string> Tags { get; set; }
    }
}
