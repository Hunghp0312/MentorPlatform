using ApplicationCore.Entity;

namespace ApplicationCore.Interfaces.RepositoryInterfaces
{
    public interface ICourseRepo : IBaseRepo<Course>
    {
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByNameAsync(string name, Guid excludeId);
    }
}
