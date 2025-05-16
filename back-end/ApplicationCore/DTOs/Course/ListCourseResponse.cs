using ApplicationCore.Common;

namespace ApplicationCore.DTOs.Course
{
    public class ListCourseResponse
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string CategoryName { get; set; }
        public CourseStatus Status { get; set; }
        public required CourseLevel Level { get; set; }
        public required string Duration { get; set; }
        public required List<string> Tags { get; set; }
    }
}
