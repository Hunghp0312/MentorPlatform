using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.DTOs.Responses.Dashboards.Mentors
{
    public class MentorDashboardDto
    {
        public SessionDashboardKpiDto SessionKPIs { get; set; } = new SessionDashboardKpiDto();
        public required List<UpcomingSessionDto> UpcomingSessions { get; set; }
        public DateTime CurrenTime { get; set; }
        public DateTime CurrenTimeNow { get; set; }
    }
}
