using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class DocumentContentRepository : BaseRepository<DocumentContent>, IDocumentContentRepository
    {
        public DocumentContentRepository(AppDbContext context) : base(context)
        {
        }

    }
}
