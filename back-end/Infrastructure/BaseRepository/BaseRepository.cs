using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.BaseRepository
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : class
    {
        protected readonly AppDbContext _context;

        protected readonly DbSet<TEntity> _dbSet;

        public BaseRepository(AppDbContext context)
        {
            _context = context;

            _dbSet = _context.Set<TEntity>();
        }

        public virtual async Task AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public virtual void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        public virtual void DeleteRange(IEnumerable<TEntity> entities)
        {
            _dbSet.RemoveRange(entities);
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

        public virtual bool DeleteEntityById(Guid id)
        {
            var obj = _dbSet.Find(id);

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

        public virtual async Task<ICollection<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual IQueryable<TEntity> GetAllQueryable()
        {
            return _dbSet;
        }
    }
}