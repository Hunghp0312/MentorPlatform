using System.Threading.Tasks;
using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

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
                                 .Include(up => up.UserTopicOfInterests) // Eager load related data
                                 .Include(up => up.TeachingApproaches)
                                 .Include(up => up.UserProfileAvailabilities)
                                 .FirstOrDefaultAsync(up => up.Id == userId);
        }

        public async Task UpdateUserProfileAsync(UserProfile userProfile)
        {
            _context.Set<UserProfile>().Update(userProfile);
            // No SaveChangesAsync() here, UnitOfWork will handle it.
            await Task.CompletedTask;
        }
    }
}
