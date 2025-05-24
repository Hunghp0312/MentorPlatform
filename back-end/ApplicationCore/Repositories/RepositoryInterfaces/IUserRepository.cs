using Infrastructure.BaseRepository;
using Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories.RepositoryInterfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email);

    Task<IEnumerable<User>> GetAllUsersAsync(); // Ensures Role is included

    // GetByIdAsync(Guid id) is inherited from IBaseRepository<User>
    // and should be overridden in UserRepository to include Role.

    Task UpdateUserAsync(User user); // To handle user updates and save changes
}
