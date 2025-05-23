using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.Include(u=> u.Role).FirstOrDefaultAsync(u => u.Email == email);
    }
    public override async Task<User?> GetByIdAsync(Guid id)
    {
        return await _dbSet.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
    }
}

