using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ISupportingDocumentRepository : IBaseRepository<SupportingDocument>
    {
        Task<SupportingDocument?> GetSupportingDocumentWithContentAsync(Guid fileId);
    }
}
