namespace ApplicationCore.DTOs.Responses.Dashboards.Mentors
{
    public class SessionDashboardKpiDto
    {
        public int SessionsThisMonth { get; set; }
        public int PendingRequests { get; set; }
        public int ActiveLearners { get; set; }
    }
}
