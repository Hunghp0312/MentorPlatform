using ApplicationCore.Common;

namespace ApplicationCore.Entity
{
    public class Course
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public required string Duration { get; set; }
        public Guid MentorId { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastUpdated { get; set; }
        public required string Tags { get; set; }
    }
}
