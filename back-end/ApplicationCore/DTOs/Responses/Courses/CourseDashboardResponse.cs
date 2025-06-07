namespace ApplicationCore.DTOs.Responses.Courses
{
    public class CourseDashboardResponse
    {
        public string Name { get; set; } = string.Empty;
        public string CourseStatus { get; set; } = string.Empty;
        public string CourseLevel { get; set; } = string.Empty;
        public DateTime Created { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int NumberOfStudent { get; set; }
        public int CompletePercent { get; set; }
    }
}
