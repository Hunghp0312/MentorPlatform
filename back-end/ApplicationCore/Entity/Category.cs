namespace ApplicationCore.Entity
{
    public class Category
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public CategoryStatus Status { get; set; }
        public ICollection<Course> Courses { get; set; } = new List<Course>();
        public int CourseCount => Courses?.Count ?? 0;
    }
}
