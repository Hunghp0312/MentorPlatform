using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IMentorRepository _mentorRepository;
        private readonly IDocumentContentRepository _documentContentRepository;

        public DashboardService(IUserRepository userRepository, ICourseRepository courseRepository, IMentorRepository mentorRepository, IDocumentContentRepository documentContentRepository)
        {
            _userRepository = userRepository;
            _courseRepository = courseRepository;
            _mentorRepository = mentorRepository;
            _documentContentRepository = documentContentRepository;
        }

        public async Task<DashboardStatisticsResponseDto> GetDashboardStatisticsAsync()
        {
            var users = _userRepository.GetAllQueryable();
            var courses = _courseRepository.GetAllQueryable();
            var mentors = _mentorRepository.GetAllQueryable();
            var resources = _documentContentRepository.GetAllQueryable();

            var totalUsers = await users.CountAsync();
            var totalCourses = await courses.CountAsync();
            var totalMentors = await users.CountAsync(u => u.RoleId == 3);
            var totalLearners = await users.CountAsync(u => u.RoleId == 2);
            var totalResources = await resources.CountAsync();
            var pendingApprovals = await mentors.CountAsync(m => m.ApplicationStatus.Name == "Pending");

            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var startOfLastMonth = startOfThisMonth.AddMonths(-1);

            var addedThisMonth = await users.CountAsync(u => u.CreatedAt >= startOfThisMonth && u.CreatedAt < startOfThisMonth.AddMonths(1));
            var addedLastMonth = await users.CountAsync(u => u.CreatedAt >= startOfLastMonth && u.CreatedAt < startOfThisMonth);

            double percentGrowth = 0;
            if (addedLastMonth > 0)
                percentGrowth = ((double)(addedThisMonth - addedLastMonth) / addedLastMonth) * 100;
            else if (addedThisMonth > 0)
                percentGrowth = 100;
            else
                percentGrowth = 0;

            return new DashboardStatisticsResponseDto
            {
                TotalUsers = totalUsers,
                TotalMentors = totalMentors,
                TotalLearners = totalLearners,
                TotalCourses = totalCourses,
                TotalResources = totalResources,
                PendingApprovals = pendingApprovals,
                AddedUsersThisMonth = addedThisMonth,
                UserGrowthPercent = percentGrowth
            };
        }
    }
}