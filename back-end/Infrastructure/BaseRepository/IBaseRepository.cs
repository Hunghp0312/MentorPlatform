using System.Linq.Expressions;

namespace Infrastructure.BaseRepository
{
    public interface IBaseRepository<TEntity>
        where TEntity : class
    {
        Task AddAsync(TEntity entity);

        Task<TEntity?> GetByIdAsync(Guid id);

        Task<ICollection<TEntity>> GetAllAsync();

        Task<ICollection<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);

        Task AddRangeAsync(ICollection<TEntity> entities);

        Task<(ICollection<TEntity>, int)> GetPagedAsync(
            Func<IQueryable<TEntity>, IQueryable<TEntity>>? filter,
            int pageIndex,
            int pageSize
        );

        void Update(TEntity entity);

        void Delete(TEntity entity);

        void DeleteRange(IEnumerable<TEntity> entities);

        Task<bool> DeleteById(Guid id);

        IQueryable<TEntity> GetAllQueryable();
    }
}
