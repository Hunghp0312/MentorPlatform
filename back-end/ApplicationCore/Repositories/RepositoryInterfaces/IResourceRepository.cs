using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IResourceRepository : IBaseRepository<Resource>
    {
        Task<Resource?> GetByDocumentContentIdAsync(Guid documentContentId);
    }
}