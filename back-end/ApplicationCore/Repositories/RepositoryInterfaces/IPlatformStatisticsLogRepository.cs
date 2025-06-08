using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IPlatformStatisticsLogRepository
    {
        Task AddAsync(PlatformStatisticLog log);
        Task<List<PlatformStatisticLog>> GetLogsByDateRangeAsync(DateTime from, DateTime to);
        Task<PlatformStatisticLog?> GetLatestLogAsync();
        Task<double> GetTotalResourceSizeInMBAsync();
    }
}