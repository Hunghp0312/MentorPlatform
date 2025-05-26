
using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IRegistrationRepository : IBaseRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task AddUserProfileAsync(UserProfile userProfile);
        Task<UserProfile?> GetUserProfileAsync(Guid userId);
        Task UpdateUserProfileAsync(UserProfile userProfile);
    }
}
