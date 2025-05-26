using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IUserProfileRepository
    {
        Task AddAsync(UserProfile userProfile);
    }
}