using ApplicationCore.Common;

namespace ApplicationCore.DTOs.Course
{
    public class GetCourseDetailsResponse
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required Guid CategoryId { get; set; }
        public required string CategoryName { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public required string Duration { get; set; }
        public DateTime Created { get; set; }
        public required List<string> Tags { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
