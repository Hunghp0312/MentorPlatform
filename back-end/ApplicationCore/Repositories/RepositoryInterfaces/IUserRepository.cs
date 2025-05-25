using Infrastructure.BaseRepository;
using Infrastructure.Entities;
using System.Linq.Expressions; // Added for Expression
using ApplicationCore.DTOs.Common; // Added for PagedResult

namespace ApplicationCore.Repositories.RepositoryInterfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email);

    Task<IEnumerable<User>> GetAllUsersAsync();
    Task UpdateUserAsync(User user);
    Task<(IEnumerable<User> Users, int TotalCount)> GetUsersWithDetailsAsync(Expression<Func<User, bool>> predicate, int pageIndex, int pageSize, string? orderBy = null); // Added method
    Task<User?> GetUserByIdWithDetailsAsync(Guid userId); // Added new method
}
