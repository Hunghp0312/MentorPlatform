﻿using System.Linq.Expressions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class SessionBookingRepository
        : BaseRepository<SessionBooking>,
            ISessionBookingRepository
    {
        public SessionBookingRepository(AppDbContext context)
            : base(context) { }

        public async Task<bool> ExistsBookingForSlotAsync(
            Guid learnerId,
            Guid mentorId,
            Guid availabilitySlotId
        )
        {
            return await _dbSet.AnyAsync(s =>
                s.LearnerId == learnerId
                && s.MentorId == mentorId
                && s.MentorTimeAvailableId == availabilitySlotId
            );
        }

        public override async Task<SessionBooking?> GetByIdAsync(Guid id)
        {
            var query = await _dbSet
                .Include(a => a.SessionType)
                .Include(a => a.Status)
                .Include(x => x.MentorTimeAvailable)
                .ThenInclude(x => x.MentorDayAvailable)
                .Include(x => x.Mentor)
                .ThenInclude(x => x.UserProfile)
                .Include(x => x.Learner)
                .ThenInclude(x => x.UserProfile)
                .FirstOrDefaultAsync(m => m.Id.Equals(id));

            return query;
        }

        public override async Task<(ICollection<SessionBooking>, int)> GetPagedAsync(
            Func<IQueryable<SessionBooking>, IQueryable<SessionBooking>>? filter,
            int pageIndex,
            int pageSize
        )
        {
            var queryable = _dbSet
                .Include(a => a.SessionType)
                .Include(a => a.Status)
                .Include(a => a.Learner)
                .ThenInclude(b => b.UserProfile)
                .Include(a => a.Mentor)
                .ThenInclude(b => b.UserProfile)
                .Include(x => x.MentorTimeAvailable)
                .ThenInclude(y => y.MentorDayAvailable)
                .AsQueryable();

            if (filter != null)
            {
                queryable = filter(queryable);
            }

            var totalRecords = await queryable.CountAsync();
            var items = await queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalRecords);
        }

        public async Task<bool> AnyAsync(Expression<Func<SessionBooking, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public override async Task<ICollection<SessionBooking>> GetAllAsync()
        {
            return await _dbSet
                .Include(a => a.SessionType)
                .Include(a => a.Status)
                .Include(a => a.Learner)
                .ThenInclude(b => b.UserProfile)
                .Include(a => a.Mentor)
                .ThenInclude(b => b.UserProfile)
                .Include(x => x.MentorTimeAvailable)
                .ThenInclude(y => y.MentorDayAvailable)
                .Where(s => s.StatusId == 6)
                .ToListAsync();
        }

        public async Task<SessionBooking?> GetBookingDetailsForDtoAsync(Guid id)
        {
            var query = await _dbSet
                .Include(x => x.MentorTimeAvailable)
                .FirstOrDefaultAsync(m => m.Id.Equals(id));

            return query;
        }

        public async Task<ICollection<SessionBooking>> GetUpcomingBookingWithLearnerId(
            Guid learnerId,
            DateTime dateTime
        )
        {
            var start = dateTime;
            var end = dateTime.AddHours(24);

            // Split into DateOnly and TimeOnly for accurate filtering
            var startDay = DateOnly.FromDateTime(start);
            var endDay = DateOnly.FromDateTime(end);
            var startTime = TimeOnly.FromDateTime(start);
            var endTime = TimeOnly.FromDateTime(end);

            var query = _dbSet
                .AsNoTracking() // no change tracking → faster for read-only
                .Include(x => x.MentorTimeAvailable)
                .ThenInclude(y => y.MentorDayAvailable)
                .Where(x =>
                    x.LearnerId == learnerId
                    && x.StatusId == 6
                    && (
                        x.MentorTimeAvailable.MentorDayAvailable.Day > startDay
                        || (
                            x.MentorTimeAvailable.MentorDayAvailable.Day == startDay
                            && x.MentorTimeAvailable.Start >= startTime
                        )
                    )
                    && (
                        x.MentorTimeAvailable.MentorDayAvailable.Day < endDay
                        || (
                            x.MentorTimeAvailable.MentorDayAvailable.Day == endDay
                            && x.MentorTimeAvailable.Start <= endTime
                        )
                    )
                )
                .OrderBy(x => x.MentorTimeAvailable.MentorDayAvailable.Day)
                .ThenBy(x => x.MentorTimeAvailable.Start);

            return await query.ToListAsync();
        }
    }
}
