using ApplicationCore.Common;

namespace ApplicationCore.DTOs.Category
{
    public class CategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public CategoryStatus Status { get; set; }
        public int CourseCount { get; set; }
    }
}
