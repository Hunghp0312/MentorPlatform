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

    public async Task<MentorDayAvailable?> GetByMentorAndDateAsync(
        Guid mentorId,
        DateOnly day,
        bool includeSlots = false
    )
    {
        var query = _dbSet.Where(d => d.MentorId == mentorId && d.Day == day);
        if (includeSlots)
        {
            query = query.Include(d => d.MentorTimeAvailables);
        }
        return await query.FirstOrDefaultAsync();
    }

    public async Task<ICollection<MentorDayAvailable>> GetByMentorAndDateRangeAsync(
        Guid mentorId,
        DateOnly start,
        DateOnly end,
        bool includeSlots = false
    )
    {
        var query = _dbSet.Where(d => d.MentorId == mentorId && d.Day >= start && d.Day <= end);
        if (includeSlots)
        {
            query = query.Include(d => d.MentorTimeAvailables);
        }
        return await query.ToListAsync();
    }

    public async Task<ICollection<MentorDayAvailable>> UpdateScheduleSettingsAndGetUpdatedDaysAsync(
        Guid mentorId,
        DateOnly startDate,
        DateOnly endDate,
        TimeOnly workDayStartTime,
        TimeOnly workDayEndTime,
        TimeOnly sessionDuration,
        TimeOnly bufferTime
    )
    {
        var updatedDays = new List<MentorDayAvailable>();
        var existingDays = await _dbSet
            .Where(d => d.MentorId == mentorId && d.Day >= startDate && d.Day <= endDate)
            .ToListAsync();

        for (
            var currentDate = startDate;
            currentDate <= endDate;
            currentDate = currentDate.AddDays(1)
        )
        {
            var dayToUpdate = existingDays.FirstOrDefault(d => d.Day == currentDate);

            if (dayToUpdate != null)
            {
                // Update existing day
                dayToUpdate.StartWorkTime = workDayStartTime;
                dayToUpdate.EndWorkTime = workDayEndTime;
                dayToUpdate.SessionDuration = sessionDuration;
                dayToUpdate.BufferTime = bufferTime;
                // EF Core tracks changes, so no explicit _dbSet.Update needed if entity is tracked
            }
            else
            {
                // Create new day
                dayToUpdate = new MentorDayAvailable
                {
                    Id = Guid.NewGuid(), // Assuming Id is generated here or by DB
                    MentorId = mentorId,
                    Day = currentDate,
                    StartWorkTime = workDayStartTime,
                    EndWorkTime = workDayEndTime,
                    SessionDuration = sessionDuration,
                    BufferTime = bufferTime,
                };
                await _dbSet.AddAsync(dayToUpdate);
            }
            updatedDays.Add(dayToUpdate);
        }
        // The actual saving of changes will be handled by UnitOfWork.SaveChangesAsync() in the service layer.
        return updatedDays;
    }
}
