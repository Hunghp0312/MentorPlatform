using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;
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

        query = query.Include(d => d.MentorTimeAvailables);

        return await query.ToListAsync();
    }

    public async Task<ICollection<MentorDayAvailable>> GetDaysAvailabilityAsync(
        SaveDaysAvailabilityRequestDto request
    )
    {
        var mentorId = request.MentorId;
        // Convert requestedDates to List<DateOnly> for proper comparison
        var requestedDates = request.Days.Select(d => DateOnly.Parse(d.Date)).ToList();

        var days = await _dbSet
            .Include(d => d.MentorTimeAvailables)
            .Where(d => d.MentorId == mentorId && requestedDates.Contains(d.Day))
            .ToListAsync();

        return days;
    }

    public async Task<MentorDayAvailable?> GetDayAvailabilityAsync(Guid mentorId, DateOnly day)
    {
        var resDay = await _dbSet
            .Include(d => d.MentorTimeAvailables)
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
            _dbSet.Remove(dayAvailable);
        }
    }
}
