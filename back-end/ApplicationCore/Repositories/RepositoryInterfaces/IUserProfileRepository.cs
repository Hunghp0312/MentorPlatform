using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IUserProfileRepository : IBaseRepository<UserProfile>
    {
        new Task AddAsync(UserProfile userProfile);
    }
}