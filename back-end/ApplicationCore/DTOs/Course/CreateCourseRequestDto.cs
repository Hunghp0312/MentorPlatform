namespace ApplicationCore.DTOs.Course
{
    public class CreateCourseRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public string Duration { get; set; } = string.Empty;
    }
}
