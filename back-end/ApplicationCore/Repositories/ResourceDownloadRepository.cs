using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class ResourceDownloadRepository : BaseRepository<ResourceDownload>, IResourceDownloadRepository
    {
        public ResourceDownloadRepository(AppDbContext context) : base(context)
        {
        }

    }
}