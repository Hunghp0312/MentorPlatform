using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories;

public class MentorDayAvailableRepository
    : BaseRepository<MentorDayAvailable>,
        IMentorDayAvailableRepository
{
    public MentorDayAvailableRepository(AppDbContext context)
        : base(context) { }

    public async Task<MentorDayAvailable?> GetByMentorAndDateAsync(Guid mentorId, DateOnly day)
    {
        var query = _dbSet.Where(d => d.MentorId == mentorId && d.Day == day);
        query = query.Include(d => d.MentorTimeAvailables);

        return await query.FirstOrDefaultAsync();
    }

    public async Task<ICollection<MentorDayAvailable>> GetByMentorAndDateRangeAsync(
        Guid mentorId,
        DateOnly start,
        DateOnly end
    )
    {
        var query = _dbSet.Where(d => d.MentorId == mentorId && d.Day >= start && d.Day <= end);

        query = query.Include(d => d.MentorTimeAvailables).ThenInclude(mta => mta.Status);

        return await query.ToListAsync();
    }

    public async Task<MentorDayAvailable?> GetDayAvailabilityAsync(Guid mentorId, DateOnly day)
    {
        var resDay = await _dbSet
            .Include(d => d.MentorTimeAvailables)
            .ThenInclude(mta => mta.Status)
            .FirstOrDefaultAsync(d => d.MentorId == mentorId && d.Day == day);

        return resDay;
    }

    public async Task DeleteDayAvailable(Guid mentorId, ICollection<DateOnly> days)
    {
        var dayAvailable = await _dbSet.FirstOrDefaultAsync(d =>
            d.MentorId == mentorId && days.Contains(d.Day)
        );
        if (dayAvailable != null)
        {
            Delete(dayAvailable);
        }
    }

    public async Task<MentorDayAvailable?> GetTimeSlotOfDayAsync(Guid mentorId, DateOnly date)
    {
        var currentDate = DateTime.UtcNow;
        DateOnly todayUtc = DateOnly.FromDateTime(currentDate);
        TimeOnly timeNowUtc = TimeOnly.FromDateTime(currentDate);
        return await _dbSet
            .Include(a => a.MentorTimeAvailables)
            .Include(a => a.Mentor)
            .ThenInclude(u => u.UserProfile)
            .Include(a => a.Mentor)
            .ThenInclude(up => up.UserAreaOfExpertises)
            .ThenInclude(up => up.AreaOfExpertise)
            .Where(d =>
                    d.MentorTimeAvailables.Any(s =>
                       (s.StatusId == 1 || s.StatusId == 4) &&
                    (
                        d.Day > todayUtc ||
                        (d.Day == todayUtc && s.Start > timeNowUtc)
                    )
                ))
            .FirstOrDefaultAsync(up => up.MentorId == mentorId && up.Day == date);
    }
}
