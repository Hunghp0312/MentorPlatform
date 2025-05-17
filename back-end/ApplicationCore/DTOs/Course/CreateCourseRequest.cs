using ApplicationCore.Common;

namespace ApplicationCore.DTOs.Course
{
    public class CreateCourseRequest
    {
        public required string Title { get; set; }
        public Guid CategoryId { get; set; }
        public Guid MentorId { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public required string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public required string Duration { get; set; }
    }
}
