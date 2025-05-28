using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IUserProfileRepository : IBaseRepository<UserProfile>
    {
        Task AddAsync(UserProfile userProfile);
    }
}