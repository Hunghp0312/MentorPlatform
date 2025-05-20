namespace ApplicationCore.DTOs.Requests.Courses
{
    public class CreateCourseRequest
    {
        public required string Title { get; set; }
        public Guid CategoryId { get; set; }
        public Guid MentorId { get; set; }
        public int StatusId { get; set; }
        public int LevelId { get; set; }
        public required string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public required string Duration { get; set; }
    }
}
