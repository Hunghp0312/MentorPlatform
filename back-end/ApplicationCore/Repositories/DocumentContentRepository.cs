using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class DocumentContentRepository : BaseRepository<DocumentContent>, IDocumentContentRepository
    {
        public DocumentContentRepository(AppDbContext context) : base(context)
        {
        }
    }
}
