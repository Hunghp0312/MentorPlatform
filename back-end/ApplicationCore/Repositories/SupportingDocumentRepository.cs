using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories;

public class SupportingDocumentRepository : BaseRepository<SupportingDocument>, ISupportingDocumentRepository
{
    public SupportingDocumentRepository(AppDbContext context) : base(context)
    {
    }
}