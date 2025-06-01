using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class MentorDayAvailableRepository : BaseRepository<MentorDayAvailable>, IMentorDayAvailableRepository
    {
        public MentorDayAvailableRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<MentorDayAvailable?> GetTimeSlotOfDayAsync(Guid mentorId, DateOnly date)
        {
            return await _dbSet
                .Include(a => a.MentorTimeAvailables)
                .FirstOrDefaultAsync(up => up.MentorId == mentorId && up.Day == date);
        }
    }
}
