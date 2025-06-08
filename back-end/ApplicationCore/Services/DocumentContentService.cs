using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class DocumentContentService : IDocumentContentService
    {
        private readonly IDocumentContentRepository _documentContentRepository;
        public DocumentContentService(IDocumentContentRepository documentContentRepository)
        {
            _documentContentRepository = documentContentRepository;
        }
        public async Task<OperationResult<FileDownloadDto>> DownloadResourceFileAsync(Guid fileId, Guid userId)
        {
            var file = await _documentContentRepository.GetByIdAsync(fileId);

            if (file == null)
            {
                return OperationResult<FileDownloadDto>.NotFound("File not found.");
            }

            var fileDownloadDto = new FileDownloadDto
            {
                Content = file.FileContent,
                ContentType = file.FileType,
                FileName = file.FileName
            };

            return OperationResult<FileDownloadDto>.Ok(fileDownloadDto);
        }

    }
}
