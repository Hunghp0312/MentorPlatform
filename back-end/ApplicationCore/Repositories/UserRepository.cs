using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ApplicationCore.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.Include(u => u.Role)
                           .Include(u => u.UserProfile)
                           .FirstOrDefaultAsync(u => u.Email == email);
    }

    public override async Task<User?> GetByIdAsync(Guid id)
    {
        return await _dbSet.Include(u => u.Role)
                           .Include(u => u.UserProfile)
                           .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _dbSet
                             .Include(u => u.Role)
                             .Include(u => u.Status)
                             .Include(u => u.UserProfile)
                             .Include(u => u.UserAreaOfExpertises)
                            .ThenInclude(ua => ua.AreaOfExpertise)
                             .ToListAsync();
    }

    public async Task UpdateUserAsync(User user)
    {
        _dbSet.Update(user);
        await Task.CompletedTask;
    }

    public async Task<(IEnumerable<User> Users, int TotalCount)> GetUsersWithDetailsAsync(
        Expression<Func<User, bool>> predicate,
        int pageIndex,
        int pageSize,
        string? orderBy = null)
    {
        IQueryable<User> query = _dbSet;

        if (predicate != null)
        {
            query = query.Where(predicate);
        }


        query = query.Include(u => u.Role)
                     .Include(u => u.Status)
                     .Include(u => u.UserProfile)
                     .Include(u => u.UserAreaOfExpertises)
                     .ThenInclude(ua => ua.AreaOfExpertise);

        if (!string.IsNullOrWhiteSpace(orderBy))
        {
            bool isDescending = orderBy.EndsWith(" desc", StringComparison.OrdinalIgnoreCase);
            string propertyName = isDescending ? orderBy.Substring(0, orderBy.Length - 5).Trim() : orderBy.Trim();

            if (propertyName.Equals("FullName", StringComparison.OrdinalIgnoreCase))
            {
                query = isDescending ? query.OrderByDescending(u => u.UserProfile.FullName) : query.OrderBy(u => u.UserProfile.FullName);
            }
            else if (propertyName.Equals("Email", StringComparison.OrdinalIgnoreCase))
            {
                query = isDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email);
            }
            else if (propertyName.Equals("Role", StringComparison.OrdinalIgnoreCase))
            {

                query = isDescending ? query.OrderByDescending(u => u.Role != null ? u.Role.Name : string.Empty)
                                     : query.OrderBy(u => u.Role != null ? u.Role.Name : string.Empty);
            }
            else if (propertyName.Equals("JoinDate", StringComparison.OrdinalIgnoreCase))
            {
                query = isDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt);
            }
            else if (propertyName.Equals("LastActiveDate", StringComparison.OrdinalIgnoreCase))
            {
                query = isDescending ? query.OrderByDescending(u => u.LastLogin) : query.OrderBy(u => u.LastLogin);
            }
            else
            {
                query = query.OrderBy(u => u.CreatedAt);
            }
        }
        else
        {
            query = query.OrderBy(u => u.CreatedAt);
        }

        var totalCount = await query.CountAsync();

        var users = await query.Skip((pageIndex - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        return (users, totalCount);
    }

    public async Task<User?> GetUserByIdsAsync(Guid userId)
    {
        return await _dbSet
                             .Include(u => u.Role)
                             .Include(u => u.Status)
                             .Include(u => u.UserProfile)
                             .Include(u => u.UserAreaOfExpertises)
                             .ThenInclude(ua => ua.AreaOfExpertise)
                             .Include(u => u.SubmittedMentorApplication)
                             .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<User?> GetUserByRefreshTokenAsync(string token)
    {
        return await _dbSet.Include(u => u.Role)
                           .Include(u => u.UserProfile)
                           .FirstOrDefaultAsync(u => u.RefreshToken == token);
    }
}

