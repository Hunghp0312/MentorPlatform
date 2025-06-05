using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class Course
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public int StatusId { get; set; }
        public CourseStatus? Status { get; set; }
        public int LevelId { get; set; }
        public CourseLevel? Level { get; set; }
        public required string Duration { get; set; }
        public Guid MentorId { get; set; }
        public User? Mentor { get; set; }
        public virtual ICollection<LearnerCourse> LearnerCourses { get; set; } = new List<LearnerCourse>();
        public DateTime Created { get; set; }
        public DateTime LastUpdated { get; set; }
        public required string Tags { get; set; }
        public ICollection<Resource> Resources { get; set; } = [];
    }
}