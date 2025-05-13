using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces.RepositoryInterfaces
{
    public interface IBaseRepo<TEntity> where TEntity : class
    {
        Task AddAsync(TEntity entity);

        Task<TEntity?> GetByIdAsync(Guid id);

        Task<ICollection<TEntity>> GetAllAsync();

        Task AddRangeAsync(ICollection<TEntity> entities);

        Task<(ICollection<TEntity>, int)> GetPagedAsync(int pageIndex, int pageSize);

        void Update(TEntity entity);

        void Delete(TEntity entity);

        Task<bool> DeleteById(Guid id);
    }
}