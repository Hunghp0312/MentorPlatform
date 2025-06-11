namespace ApplicationCore.DTOs.Responses.Courses
{
    public class CourseDashboardKpiDto
    {
        public int TotalCourses { get; set; }
        public int StudentEnrollments { get; set; }
        public int AverageCompletion { get; set; }
        public int PublishedCourses { get; set; }
    }
}
