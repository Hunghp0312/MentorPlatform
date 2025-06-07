namespace ApplicationCore.DTOs.Responses.Dashboards.Learners
{
    public class LearnerDashboardCourseList
    {
        public required ICollection<LearnerDashboardCourse> CourseList { get; set; }
    }

    public class LearnerDashboardCourse
    {
        public required string CourseName { get; set; }
        public required string CourseCategory { get; set; }
        public required bool IsCompleted { get; set; }
    }
}
