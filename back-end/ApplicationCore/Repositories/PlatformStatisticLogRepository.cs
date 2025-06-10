using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class PlatformStatisticsLogRepository : BaseRepository<PlatformStatisticLog>, IPlatformStatisticsLogRepository
    {
        public PlatformStatisticsLogRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<List<PlatformStatisticLog>> GetLogsByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Set<PlatformStatisticLog>()
                .Where(x => x.Date >= from && x.Date <= to)
                .OrderBy(x => x.Date)
                .ToListAsync();
        }

        public async Task<PlatformStatisticLog?> GetLatestLogAsync()
        {
            return await _context.Set<PlatformStatisticLog>()
                .OrderByDescending(x => x.Date)
                .FirstOrDefaultAsync();
        }
        public async Task<double> GetTotalResourceSizeInMBAsync()
        {
            var totalSize = await _context.Set<Resource>().SumAsync(r => r.ToTalFileDownloadSize);
            return Math.Round(totalSize, 2);
        }
    }
}