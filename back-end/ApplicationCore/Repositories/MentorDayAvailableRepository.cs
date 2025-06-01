using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories;

public class MentorDayAvailableRepository : BaseRepository<MentorDayAvailable>, IMentorDayAvailableRepository
{
    public MentorDayAvailableRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<MentorDayAvailable?> GetByMentorAndDateAsync(Guid mentorId, DateOnly day, bool includeSlots = false)
    {
        var query = _dbSet.Where(d => d.MentorId == mentorId && d.Day == day);
        if (includeSlots)
        {
            query = query.Include(d => d.MentorTimeAvailables);
        }
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ICollection<MentorDayAvailable>> GetByMentorAndDateRangeAsync(Guid mentorId, DateOnly start, DateOnly end, bool includeSlots = false)
    {
        var query = _dbSet.Where(d => d.MentorId == mentorId && d.Day >= start && d.Day <= end);
        if (includeSlots)
        {
            query = query.Include(d => d.MentorTimeAvailables);
        }
        return await query.ToListAsync();
    }
}