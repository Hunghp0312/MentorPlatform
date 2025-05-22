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
    }
}
