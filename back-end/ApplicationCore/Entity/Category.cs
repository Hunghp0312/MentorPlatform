namespace ApplicationCore.Entity
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public ICollection<Course> Courses { get; set; }
        public int CourseCount { get; set; }
    }
}