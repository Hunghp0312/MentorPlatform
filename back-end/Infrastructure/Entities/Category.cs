using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; } = string.Empty;
        public required int StatusId { get; set; }
        public CategoryStatus? Status { get; set; }
        public ICollection<Course> Courses { get; set; } = [];
        public int CourseCount => Courses?.Count ?? 0;
    }
}
