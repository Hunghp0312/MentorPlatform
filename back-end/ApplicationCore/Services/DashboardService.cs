
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class DashboardService : IDashboardService

    {
        private readonly IUserRepository _userRepository;
        private readonly ISessionBookingRepository _sessionBookingRepository;
        // private readonly IResourceRepository _resourceRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IMentorRepository _mentorRepository;

        private readonly IDocumentContentRepository _documentContentRepository;

        public DashboardService(IUserRepository userRepository, ISessionBookingRepository sessionBookingRepository, ICourseRepository courseRepository, IMentorRepository mentorRepository, IDocumentContentRepository documentContentRepository)
        {
            _userRepository = userRepository;
            _sessionBookingRepository = sessionBookingRepository;
            _courseRepository = courseRepository;
            _mentorRepository = mentorRepository;
            _documentContentRepository = documentContentRepository;
        }

        public async Task<DashboardStatisticsResponseDto> GetDashboardStatisticsAsync()
        {
            var totalUsers = await _userRepository.CountAsync();
            var totalSessions = await _sessionBookingRepository.CountAsync();
            var totalCourses = await _courseRepository.CountAsync();
            var totalMentors = await _userRepository.CountAsync(u => u.Role.Name == "Mentor");
            var totalLearners = await _userRepository.CountAsync(u => u.Role.Name == "Learner");
            var totalResources = await _documentContentRepository.CountAsync();
            var pendingApprovals = await _mentorRepository.CountAsync(m => m.ApplicationStatus.Name == "Pending");
            return new DashboardStatisticsResponseDto
            {
                TotalUsers = totalUsers,
                TotalMentors = totalMentors,
                TotalLearners = totalLearners,
                TotalSessions = totalSessions,
                TotalCourses = totalCourses,
                TotalResources = totalResources,
                PendingApprovals = pendingApprovals
            };
        }
    }
}