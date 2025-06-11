namespace ApplicationCore.DTOs.Responses.Dashboards.Learners
{
    public class LearnerDashboardUpcomingSession
    {
        public int NumberOfUpcomingSession { get; set; }
        public string? NextSessionDay { get; set; }
        public TimeOnly NextSessionTime { get; set; }
    }
}
