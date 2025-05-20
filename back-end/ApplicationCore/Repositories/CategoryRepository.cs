using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context)
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
                .Include(c => c.Status)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        public override async Task<(ICollection<Category>, int)> GetPagedAsync(
            Func<IQueryable<Category>, IQueryable<Category>>? filter,
            int pageIndex,
            int pageSize)
        {
            var queryable = _dbSet
                .Include(c => c.Courses)
                .Include(c => c.Status)
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
