namespace ApplicationCore.DTOs.Responses.Dashboards.Learners
{
    public class LearnerDashboardUpcomingSession
    {
        public int NumberOfUpcomingSession { get; set; }
        public required string NextSessionDay { get; set; }
        public required TimeOnly NextSessionTime { get; set; }
    }
}
