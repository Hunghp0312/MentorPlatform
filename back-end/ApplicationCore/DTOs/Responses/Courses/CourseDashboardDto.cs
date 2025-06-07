namespace ApplicationCore.DTOs.Responses.Courses
{
    public class CourseDashboardDto
    {
        public CourseDashboardKpiDto CourseKPIs { get; set; } = new CourseDashboardKpiDto();
        public required List<CourseDashboardResponse> Courses { get; set; }
    }
}
