using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class SessionBookingRepository : BaseRepository<SessionBooking>, ISessionBookingRepository
    {
        public SessionBookingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsBookingForSlotAsync(Guid learnerId, Guid mentorId, Guid availabilitySlotId)
        {
            return await _dbSet.AnyAsync(s => s.LearnerId == learnerId && s.MentorId == mentorId && s.AvailabilitySlotId == availabilitySlotId);
        }

        public override async Task<SessionBooking?> GetByIdAsync(Guid id)
        {
            var query = await _dbSet.Include(a => a.SessionType)
                .Include(a => a.Status)
                .Include(x => x.AvailabilitySlot)
                .Include(x => x.Mentor)
                    .ThenInclude(x => x.UserProfile)
                .Include(x => x.Learner)
                     .ThenInclude(x => x.UserProfile)
                .FirstOrDefaultAsync(m => m.Id.Equals(id));

            return query;
        }
    }
}
