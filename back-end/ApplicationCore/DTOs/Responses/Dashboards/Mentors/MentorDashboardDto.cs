using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.DTOs.Responses.Dashboards.Mentors
{
    public class MentorDashboardDto
    {
        public SessionDashboardKpiDto SessionKPIs { get; set; } = new SessionDashboardKpiDto();
        public required PagedResult<UpcomingSessionDto> UpcomingSessions { get; set; }

        //public List<MentorCourseSummaryDto> YourCourses { get; set; } = new List<MentorCourseSummaryDto>();
        //public CourseStatsDto CourseStatistics { get; set; } = new CourseStatsDto();
    }
}
