namespace ApplicationCore.DTOs.Requests.Courses
{
    public class UpdateCourseRequest
    {
        public required string Title { get; set; }
        public Guid CategoryId { get; set; }
        public int StatusId { get; set; }
        public int LevelId { get; set; }
        public required string Description { get; set; }
        public required string Duration { get; set; }
        public required List<string> Tags { get; set; }
    }
}
