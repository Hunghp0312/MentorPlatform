using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.Dashboards.Learners;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class LearnerDashboardService : ILearnerDashboardService
    {
        private readonly ISessionBookingRepository _sessionRepo;

        private readonly ILearnerCourseRepository _learnerCourseRepo;

        public LearnerDashboardService(
            ISessionBookingRepository sessionRepo,
            ILearnerCourseRepository learnerCourseRepo
        )
        {
            _sessionRepo = sessionRepo;
            _learnerCourseRepo = learnerCourseRepo;
        }

        public async Task<OperationResult<LearnerDashboardUpcomingSession>> GetUpComingSessions(
            Guid learnerId
        )
        {
            var todayDate = DateTime.Now;

            var upcomingsessions = await _sessionRepo.GetUpcomingBookingWithLearnerId(
                learnerId,
                todayDate
            );

            var nextSessionDate = upcomingsessions
                .First()
                .MentorTimeAvailable.MentorDayAvailable.Day;
            string nextSessionDay;
            if (nextSessionDate == DateOnly.FromDateTime(todayDate))
            {
                nextSessionDay = "Today";
            }
            else if (nextSessionDate == DateOnly.FromDateTime(todayDate.AddDays(1)))
            {
                nextSessionDay = "Tomorrow";
            }
            else
            {
                nextSessionDay = nextSessionDate.ToString("yyyy-MM-dd");
            }

            var response = new LearnerDashboardUpcomingSession
            {
                NumberOfUpcomingSession = upcomingsessions.Count,
                NextSessionDay = nextSessionDay,
                NextSessionTime = upcomingsessions.First().MentorTimeAvailable.Start,
            };

            return OperationResult<LearnerDashboardUpcomingSession>.Ok(response);
        }

        public async Task<OperationResult<LearnerDashboardCompletion>> GetLearningProgress(
            Guid learnerId
        )
        {
            var learnerCourses = await _learnerCourseRepo.GetLearnerCoursesWithLearnerId(learnerId);

            var totalCourses = learnerCourses.Count;

            var doneCourses = learnerCourses.Count(c => c.IsCompleted);

            var response = new LearnerDashboardCompletion
            {
                LearningProgress =
                    totalCourses == 0
                        ? 0
                        : (int)Math.Round((double)doneCourses / totalCourses * 100),
            };

            return OperationResult<LearnerDashboardCompletion>.Ok(response);
        }

        public async Task<OperationResult<LearnerDashboardMentor>> GetMentors(Guid learnerId)
        {
            var learnerCourses = await _learnerCourseRepo.GetLearnerCoursesWithLearnerId(learnerId);

            var mentorIds = learnerCourses
                .Select(lc => lc.Course!.MentorId)
                .Where(id => id != null)
                .Distinct()
                .ToList();

            var response = new LearnerDashboardMentor { NumberOfMentors = mentorIds.Count };

            return OperationResult<LearnerDashboardMentor>.Ok(response);
        }

        public async Task<OperationResult<LearnerDashboardCourseList>> GetEnrolledCourse(
            Guid learnerId
        )
        {
            var learnerCourses = await _learnerCourseRepo.GetLearnerCoursesWithLearnerId(learnerId);

            var top3Courses = learnerCourses.Take(3).ToList();

            var coursesList = top3Courses
                .Select(course => new LearnerDashboardCourse
                {
                    CourseName = course.Course?.Name ?? string.Empty,
                    CourseCategory = course.Course?.Category?.Name ?? string.Empty,
                    IsCompleted = course.IsCompleted,
                })
                .ToList();

            var response = new LearnerDashboardCourseList { CourseList = coursesList };

            return OperationResult<LearnerDashboardCourseList>.Ok(response);
        }
    }
}
