namespace ApplicationCore.DTOs.Category
{
    public class CategoryResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public CategoryStatus Status { get; set; }
        public int CourseCount { get; set; }
    }
}
