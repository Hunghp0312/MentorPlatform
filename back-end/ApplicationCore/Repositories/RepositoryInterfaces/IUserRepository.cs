

using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task AddAsync(User user);
        Task<User?> GetByEmailAsync(string email);
    }
}