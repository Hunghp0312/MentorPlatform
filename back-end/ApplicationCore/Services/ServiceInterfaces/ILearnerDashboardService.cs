using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.Dashboards.Learners;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ILearnerDashboardService
    {
        Task<OperationResult<LearnerDashboardUpcomingSession>> GetUpComingSessions(Guid learnerId);
        Task<OperationResult<LearnerDashboardCompletion>> GetLearningProgress(Guid learnerId);
        Task<OperationResult<LearnerDashboardMentor>> GetMentors(Guid learnerId);
        Task<OperationResult<LearnerDashboardCourseList>> GetEnrolledCourse(Guid learnerId);
    }
}
