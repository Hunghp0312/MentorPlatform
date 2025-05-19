using ApplicationCore.Common;

namespace ApplicationCore.DTOs.Course
{
    public class UpdateCourseRequest
    {
        public required string Title { get; set; }
        public Guid CategoryId { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public required string Description { get; set; }
        public required string Duration { get; set; }
        public required List<string> Tags { get; set; }
    }
}
