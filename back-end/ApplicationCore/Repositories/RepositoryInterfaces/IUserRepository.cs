﻿using Infrastructure.BaseRepository;
using Infrastructure.Entities;
using System.Linq.Expressions;

namespace ApplicationCore.Repositories.RepositoryInterfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email);

    Task<IEnumerable<User>> GetAllUsersAsync();
    Task UpdateUserAsync(User user);
    Task<(IEnumerable<User> Users, int TotalCount)> GetUsersWithDetailsAsync(Expression<Func<User, bool>> predicate, int pageIndex, int pageSize, string? orderBy = null);
    Task<User?> GetUserByIdAsync(Guid id);
    Task<IEnumerable<User>> GetAllMentors(Expression<Func<User, bool>> predicate);
    Task<User?> GetByIdWithUserProfileAsync(Guid learnerId);
    Task<User?> GetMentorByIdAsync(Guid userId);
}
