using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
namespace ApplicationCore.Repositories;

public class SupportingDocumentRepository : BaseRepository<SupportingDocument>, ISupportingDocumentRepository
{
    public SupportingDocumentRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<SupportingDocument?> GetSupportingDocumentWithContentAsync(Guid fileId)
    {
        return await _dbSet
            .Include(sd => sd.DocumentContent)
            .FirstOrDefaultAsync(sd => sd.Id == fileId);
    }
}