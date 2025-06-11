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
        private readonly IResourceRepository _resourceRepository;

        public DashboardService(IUserRepository userRepository, ICourseRepository courseRepository, IMentorRepository mentorRepository, IDocumentContentRepository documentContentRepository, IResourceRepository resourceRepository)
        {
            _userRepository = userRepository;
            _courseRepository = courseRepository;
            _mentorRepository = mentorRepository;
            _documentContentRepository = documentContentRepository;
            _resourceRepository = resourceRepository;
        }

        public async Task<DashboardStatisticsResponseDto> GetDashboardStatisticsAsync()
        {
            var now = DateTime.UtcNow;
            var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
            var startOfLastMonth = startOfThisMonth.AddMonths(-1);
            var startOfThisWeek = now.AddDays(-(int)now.DayOfWeek);

            var users = _userRepository.GetAllQueryable();
            var courses = _courseRepository.GetAllQueryable();
            var mentors = _mentorRepository.GetAllQueryable()
                .Include(m => m.ApplicationStatus);
            var resources = _resourceRepository.GetAllQueryable();

            var totalUsers = await users.CountAsync();
            var totalCourses = await courses.CountAsync();
            var totalMentors = await users.CountAsync(u => u.RoleId == 3);
            var totalLearners = await users.CountAsync(u => u.RoleId == 2);
            var totalResources = await resources.CountAsync();
            var pendingApprovals = await mentors.CountAsync(m => m.ApplicationStatus.Id == 5);

            var addedUsersThisMonth = await users
                .Where(u => u.CreatedAt >= startOfThisMonth && u.CreatedAt < startOfThisMonth.AddMonths(1))
                .CountAsync();

            var addedUsersLastMonth = await users
                .Where(u => u.CreatedAt >= startOfLastMonth && u.CreatedAt < startOfThisMonth)
                .CountAsync();

            var totalUsersAtEndOfLastMonth = totalUsers - addedUsersThisMonth;

            double userGrowthPercent = 0;
            if (totalUsersAtEndOfLastMonth > 0)
            {
                userGrowthPercent = Math.Round((double)(totalUsers - totalUsersAtEndOfLastMonth) / totalUsersAtEndOfLastMonth * 100, 2);
            }
            else
            {
                if (totalUsers > 0)
                {
                    userGrowthPercent = 0;
                }
                else
                {
                    userGrowthPercent = 0;
                }
            }


            var addedCoursesThisMonth = await courses
                .Where(c => c.Created >= startOfThisMonth && c.Created < startOfThisMonth.AddMonths(1))
                .CountAsync();
            var addedCoursesLastMonth = await courses
                .Where(c => c.Created >= startOfLastMonth && c.Created < startOfThisMonth)
                .CountAsync();

            double courseGrowthPercent = 0;
            if (addedCoursesLastMonth > 0)
            {
                courseGrowthPercent = Math.Round((double)(addedCoursesThisMonth - addedCoursesLastMonth) / addedCoursesLastMonth * 100, 2);
            }
            else if (addedCoursesThisMonth > 0)
            {
                courseGrowthPercent = 100;
            }
            else
            {
                courseGrowthPercent = 0;
            }
            courseGrowthPercent = Math.Max(-100, Math.Min(1000, courseGrowthPercent));

            var addedCoursesThisWeek = await courses
                .Where(c => c.Created >= startOfThisWeek && c.Created < startOfThisWeek.AddDays(7))
                .CountAsync();

            var addedResourcesThisMonth = await resources
                .Where(r => r.UploadedAt >= startOfThisMonth && r.UploadedAt < startOfThisMonth.AddMonths(1))
                .CountAsync();
            var addedResourcesLastMonth = await resources
                .Where(r => r.UploadedAt >= startOfLastMonth && r.UploadedAt < startOfThisMonth)
                .CountAsync();

            double resourceGrowthPercent = 0;
            if (addedResourcesLastMonth > 0)
            {
                resourceGrowthPercent = Math.Round(((double)(addedResourcesThisMonth - addedResourcesLastMonth) / addedResourcesLastMonth) * 100, 2);
            }
            else if (addedResourcesThisMonth > 0)
            {
                resourceGrowthPercent = 100;
            }
            else
            {
                resourceGrowthPercent = 0;
            }
            resourceGrowthPercent = Math.Max(-100, Math.Min(1000, resourceGrowthPercent));

            var addedResourcesThisWeek = await resources
                .Where(r => r.UploadedAt >= startOfThisWeek && r.UploadedAt < startOfThisWeek.AddDays(7))
                .CountAsync();

            return new DashboardStatisticsResponseDto
            {
                TotalUsers = totalUsers,
                TotalMentors = totalMentors,
                TotalLearners = totalLearners,
                TotalCourses = totalCourses,
                TotalResources = totalResources,
                PendingApprovals = pendingApprovals,
                AddedUsersThisMonth = addedUsersThisMonth,
                UserGrowthPercent = userGrowthPercent,
                AddedCoursesThisMonth = addedCoursesThisMonth,
                CourseGrowthPercent = courseGrowthPercent,
                AddedResourcesThisMonth = addedResourcesThisMonth,
                ResourceGrowthPercent = resourceGrowthPercent,
                AddedCoursesThisWeek = addedCoursesThisWeek,
                AddedResourcesThisWeek = addedResourcesThisWeek
            };
        }
    }
}