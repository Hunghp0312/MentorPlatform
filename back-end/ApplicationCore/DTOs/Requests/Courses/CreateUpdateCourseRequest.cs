namespace ApplicationCore.DTOs.Requests.Courses
{
    public class CreateUpdateCourseRequest
    {
        public required string Name { get; set; }

        public string Title { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public int StatusId { get; set; }
        public int LevelId { get; set; }
        public required string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public required string Duration { get; set; }
    }
}
