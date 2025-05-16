using ApplicationCore.Entity;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CategoryRepo : BaseRepo<Category>, ICategoryRepo
    {
        public CategoryRepo(AppDbContext context)
            : base(context) { }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _dbSet.AnyAsync(c => c.Name == name);
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid excludeId)
        {
            return await _dbSet.AnyAsync(c =>
                c.Id != excludeId && c.Name == name
            );
        }
        public override async Task<ICollection<Category>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.Courses)
                .ToListAsync();
        }
        public override async Task<Category?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(c => c.Courses)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        public override async Task<(ICollection<Category>, int)> GetPagedAsync(
            Func<IQueryable<Category>, IQueryable<Category>>? filter,
            int pageIndex,
            int pageSize)
        {
            var queryable = _dbSet
                .Include(c => c.Courses)
                .AsQueryable();

            if (filter != null)
            {
                queryable = filter(queryable);
            }

            var totalRecords = await queryable.CountAsync();
            var items = await queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalRecords);
        }
    }
}
