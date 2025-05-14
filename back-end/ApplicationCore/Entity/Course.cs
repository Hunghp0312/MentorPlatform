namespace ApplicationCore.Entity
{
    public class Course
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
<<<<<<< HEAD
        public string Title { get; set; }

        public string Description { get; set; }
        public int Status { get; set; }
        public int Difficulty { get; set; }
=======
        public CourseStatus Status { get; set; }
        public CourseDifficulty Difficulty { get; set; }
>>>>>>> origin/feature/course-list-browsing-laq
        public string Duration { get; set; }
        public Guid MentorId { get; set; }
        public Guid ResourceId { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastUpdated { get; set; }
        public ICollection<string> Tags { get; set; }
    }
}
