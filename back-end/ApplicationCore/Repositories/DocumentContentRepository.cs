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
        // public override async Task<DocumentContent?> GetByIdAsync(Guid id)
        // {
        //     return await _dbSet.Include(d => d.Resource).ThenInclude(r => r.Course).
        //     FirstOrDefaultAsync(d => d.Id == id);
        // }
    }
}
