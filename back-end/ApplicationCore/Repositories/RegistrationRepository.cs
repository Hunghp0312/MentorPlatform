using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.Repositories
{
    public class RegistrationRepository : BaseRepository<User>, IRegistrationRepository
    {
        public RegistrationRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            await _dbSet.AddAsync(user);
        }

        public async Task AddUserProfileAsync(UserProfile userProfile)
        {
            await _context.Set<UserProfile>().AddAsync(userProfile);
        }

        public async Task<UserProfile?> GetUserProfileAsync(Guid userId)
        {
            return await _context.Set<UserProfile>()
                                 .Include(up => up.UserTopicOfInterests)
                                 .Include(up => up.TeachingApproaches)
                                 .Include(up => up.UserProfileAvailabilities)
                                 .FirstOrDefaultAsync(up => up.Id == userId);
        }

        public async Task UpdateUserProfileAsync(UserProfile userProfile)
        {
            _context.Set<UserProfile>().Update(userProfile);
            await Task.CompletedTask;
        }

        public async Task<Role?> GetRoleByIdAsync(int id)
        {
            return await _context.Set<Role>().FindAsync(id);
        }

        public async Task<AreaOfExpertise?> GetAreaOfExpertiseByIdAsync(int id)
        {
            return await _context.Set<AreaOfExpertise>().FindAsync(id);
        }
        public async Task<IEnumerable<AreaOfExpertise>> GetAreaOfExpertisesByIdsAsync(IEnumerable<int> areaIds)
        {
            if (areaIds == null || !areaIds.Any())
            {
                return Enumerable.Empty<AreaOfExpertise>();
            }
            return await _context.Set<AreaOfExpertise>()
                                 .Where(aoe => areaIds.Contains(aoe.Id))
                                 .ToListAsync();
        }
        public async Task<Availability?> GetAvailabilityByIdAsync(int availabilityId)
        {
            return await _context.Set<Availability>().FindAsync(availabilityId);
        }

        public async Task<IEnumerable<Availability>> GetAvailabilitiesByIdsAsync(IEnumerable<int> availabilityIds)
        {
            if (availabilityIds == null || !availabilityIds.Any())
            {
                return Enumerable.Empty<Availability>();
            }
            return await _context.Set<Availability>()
                                 .Where(a => availabilityIds.Contains(a.Id))
                                 .ToListAsync();
        }

        public async Task<IEnumerable<CommunicationMethod>> GetCommunicationMethodsByIdsAsync(IEnumerable<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return Enumerable.Empty<CommunicationMethod>();
            }
            return await _context.Set<CommunicationMethod>()
                                 .Where(cm => ids.Contains(cm.Id))
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Topic>> GetTopicsByIdsAsync(IEnumerable<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return Enumerable.Empty<Topic>();
            }
            return await _context.Set<Topic>().Where(t => ids.Contains(t.Id)).ToListAsync();
        }

        public async Task<IEnumerable<LearningStyle>> GetLearningStylesByIdsAsync(IEnumerable<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return Enumerable.Empty<LearningStyle>();
            }
            return await _context.Set<LearningStyle>().Where(ls => ids.Contains(ls.Id)).ToListAsync();
        }

        public async Task<IEnumerable<TeachingApproach>> GetTeachingApproachesByIdsAsync(IEnumerable<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return Enumerable.Empty<TeachingApproach>();
            }
            return await _context.Set<TeachingApproach>().Where(ta => ids.Contains(ta.Id)).ToListAsync();
        }

        public async Task<SessionFrequency?> GetSessionFrequencyByIdAsync(int id)
        {
            return await _context.Set<SessionFrequency>().FindAsync(id);
        }

        public async Task<SessionDuration?> GetSessionDurationByIdAsync(int id)
        {
            return await _context.Set<SessionDuration>().FindAsync(id);
        }
    }
}
