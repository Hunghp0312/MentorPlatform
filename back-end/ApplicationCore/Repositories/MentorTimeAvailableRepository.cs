using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class MentorTimeAvailableRepository : BaseRepository<MentorTimeAvailable>, IMentorTimeAvailableRepository
    {
        public MentorTimeAvailableRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<MentorTimeAvailable?> GetByIdAsync(Guid id)
        {
            var query = await _dbSet.Include(a => a.MentorDayAvailable)
                .FirstOrDefaultAsync(m => m.Id.Equals(id));

            return query;
        }
    }
}
