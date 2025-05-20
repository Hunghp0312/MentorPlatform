using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByNameAsync(string name, Guid excludeId);
    }
}
