namespace ApplicationCore.DTOs
{
    public class CoursePagedRequest
    {
        public string? Query { get; set; }
        public CourseLevel? Level { get; set; }
        public Guid? CategoryId { get; set; }
        public ICollection<Guid>? MentorIds { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
