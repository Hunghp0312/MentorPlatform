using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class BaseRepo<TEntity> : IBaseRepo<TEntity>
        where TEntity : class
    {
        protected readonly AppDbContext _context;

        protected readonly DbSet<TEntity> _dbSet;

        public BaseRepo(AppDbContext context)
        {
            _context = context;

            _dbSet = _context.Set<TEntity>();
        }

        public virtual async Task AddAsync(TEntity obj)
        {
            var result = await _dbSet.AddAsync(obj);
        }

        public virtual void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        public virtual async Task<bool> DeleteById(Guid id)
        {
            var obj = await _dbSet.FindAsync(id);

            if (obj == null)
            {
                return false;
            }

            _dbSet.Remove(obj);

            return true;
        }

        public virtual async Task<ICollection<TEntity>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<TEntity?> GetByIdAsync(Guid id)
        {
            var obj = await _dbSet.FindAsync(id);

            return obj;
        }

        public virtual void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }

        public virtual async Task<(ICollection<TEntity>, int)> GetPagedAsync(
            Func<IQueryable<TEntity>, IQueryable<TEntity>>? filter,
            int pageIndex,
            int pageSize
        )
        {
            var queryable = _dbSet.AsQueryable();
            if (filter != null)
            {
                queryable = filter(queryable);
            }
            var totalRecords = await queryable.CountAsync();
            var obj = await queryable.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
            return (obj, totalRecords);
        }

        public virtual async Task AddRangeAsync(ICollection<TEntity> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }
    }
}
