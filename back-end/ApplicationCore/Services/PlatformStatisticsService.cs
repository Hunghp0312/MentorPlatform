using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using ApplicationCore.DTOs.Responses.Dashboard;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Services
{
    public class PlatformStatisticsService : IPlatformStatisticsService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPlatformStatisticsLogRepository _logRepository;

        public PlatformStatisticsService(IUserRepository userRepository, IPlatformStatisticsLogRepository logRepository)
        {
            _userRepository = userRepository;
            _logRepository = logRepository;
        }

        public async Task<PlatformStatisticsResponseDto> GetPlatformStatisticsAsync()
        {
            var mentorRetention = await GetMentorRetentionAsync();
            var resourceDownloads = await _logRepository.GetTotalResourceSizeInMBAsync();
            var newUsers30d = await GetNewUsersIn30DaysAsync();

            return new PlatformStatisticsResponseDto
            {
                MentorRetention = mentorRetention,
                ResourceDownloads = resourceDownloads,
                NewUsers30d = newUsers30d
            };
        }

        private async Task<double> GetMentorRetentionAsync()
        {
            var users = _userRepository.GetAllQueryable()
                .Where(u => u.RoleId == 3)
                .Include(u => u.Status);

            var totalMentors = await users.CountAsync();
            var activeMentors = await users.CountAsync(u => u.StatusId == 1);

            if (totalMentors == 0) return 0;
            return Math.Round((double)activeMentors / totalMentors * 100, 2);
        }

        private async Task<int> GetNewUsersIn30DaysAsync()
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            return await _userRepository.GetAllQueryable()
                .Where(u => u.CreatedAt >= thirtyDaysAgo)
                .CountAsync();
        }
    }
}