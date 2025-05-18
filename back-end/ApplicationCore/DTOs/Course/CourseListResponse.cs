namespace ApplicationCore.DTOs
{
    public class CourseListResponse
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? CategoryName { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Difficulty { get; set; }
        public string? Duration { get; set; }
        public List<string>? Tags { get; set; }
        // public int Students { get; set; }
        // public int Completion { get; set; }
    }
}
