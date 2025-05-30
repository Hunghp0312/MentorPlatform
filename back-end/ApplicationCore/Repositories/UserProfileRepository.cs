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
    }
}