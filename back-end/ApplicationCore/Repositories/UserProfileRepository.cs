using ApplicationCore.Common;
using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class UserProfileRepository : BaseRepository<UserProfile>, IUserProfileRepository
    {
        public UserProfileRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<UserProfile?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(up => up.CommunicationMethod)
                .Include(up => up.User)
                .ThenInclude(up => up.UserAreaOfExpertises)
                .ThenInclude(x => x.AreaOfExpertise)
                .Include(up => up.TeachingApproaches)
                .ThenInclude(ta => ta.TeachingApproach)
                .Include(up => up.UserProfileAvailabilities)
                .ThenInclude(upa => upa.Availability)
                .Include(up => up.UserTopicOfInterests)
                .ThenInclude(uti => uti.Topic)
                .Include(up => up.UserLearningStyles)
                .ThenInclude(uls => uls.LearningStyle)
                .Include(up => up.SessionFrequency)
                .Include(up => up.SessionDuration)
                .FirstOrDefaultAsync(up => up.Id == id);
        }

        public override async Task<(ICollection<UserProfile>, int)> GetPagedAsync(
           Func<IQueryable<UserProfile>, IQueryable<UserProfile>>? filter,
           int pageIndex,
           int pageSize
       )
        {
            var queryable = _dbSet
                .Include(a => a.User)
                    .ThenInclude(uae => uae.UserAreaOfExpertises).ThenInclude(uae => uae.AreaOfExpertise)
                .Include(a => a.UserTopicOfInterests)
                    .ThenInclude(u => u.Topic)
                .Include(a => a.User)
                    .ThenInclude(a => a.DayAvailabilities)
                    .ThenInclude(d => d.MentorTimeAvailables)
                .AsQueryable();

            DateTime currentDate = DateTimeHelper.GetCurrentVietnamTime();
            DateOnly todayUtc = DateOnly.FromDateTime(currentDate);
            TimeOnly timeNowUtc = TimeOnly.FromDateTime(currentDate);
            queryable = queryable.Where(up =>
                up.User.DayAvailabilities.Any(d =>
                    d.MentorTimeAvailables.Any(s =>
                       (s.StatusId == 1 || s.StatusId == 4) &&
                    (
                        d.Day > todayUtc ||
                        (d.Day == todayUtc && s.Start > timeNowUtc)
                    )
                ))
            );

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
    }
}