namespace ApplicationCore.DTOs
{
    public class CourseDetailsResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
        public CourseStatus Status { get; set; }
        public CourseLevel Level { get; set; }
        public string Duration { get; set; }
        public DateTime Created { get; set; }
        public List<string> Tags { get; set; }
        public DateTime LastUpdated { get; set; }
        // public string MentorName { get; set; }
        // public string MentorInfo { get; set; }
        // public string Resource { get; set; }
    }
}
