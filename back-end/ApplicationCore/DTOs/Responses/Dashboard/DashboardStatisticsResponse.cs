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
}