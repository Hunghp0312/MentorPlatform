using ApplicationCore.DTOs.Category;

namespace ApplicationCore.DTOs.Course
{
    public class CourseResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public CategoryResponse Category { get; set; } = new CategoryResponse();
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public string Duration { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime Created { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
