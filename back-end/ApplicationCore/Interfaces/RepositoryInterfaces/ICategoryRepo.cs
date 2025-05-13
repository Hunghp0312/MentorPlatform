
using ApplicationCore.Entity;

namespace ApplicationCore.Interfaces.RepositoryInterfaces
{
    public interface ICategoryRepo : IBaseRepo<Category>
    {
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByNameAsync(string name, Guid excludeId);
    }
}