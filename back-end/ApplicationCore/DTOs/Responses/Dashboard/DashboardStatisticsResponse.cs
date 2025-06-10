public class DashboardStatisticsResponseDto
{
    public int TotalUsers { get; set; }
    public int TotalMentors { get; set; }
    public int TotalLearners { get; set; }
    public int TotalCourses { get; set; }
    public int PendingApprovals { get; set; }
    public int TotalResources { get; set; }
    public int AddedUsersThisMonth { get; set; }
    public double UserGrowthPercent { get; set; }
    public int AddedCoursesThisMonth { get; set; }
    public double CourseGrowthPercent { get; set; }
    public int AddedResourcesThisMonth { get; set; }
    public double ResourceGrowthPercent { get; set; }
    public int AddedCoursesThisWeek { get; set; }
    public int AddedResourcesThisWeek { get; set; }
}