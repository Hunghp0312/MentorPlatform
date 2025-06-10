using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.FileSize;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services
{
    public class DocumentContentService : IDocumentContentService
    {
        private readonly IDocumentContentRepository _documentContentRepository;
        private const double BytesToMB = 1024 * 1024;
        private readonly IResourceRepository _resourceRepository;
        private readonly IUnitOfWork _unitOfWork;
        public DocumentContentService(
            IUnitOfWork unitOfWork,
            IDocumentContentRepository documentContentRepository, IResourceRepository resourceRepository)
        {
            _documentContentRepository = documentContentRepository;
            _resourceRepository = resourceRepository;
            _unitOfWork = unitOfWork;
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
        public async Task<OperationResult<SumOfFilesResponse>> GetTotalFileDownloadSize(Guid resourceId)
        {
            var resource = await _resourceRepository.GetByIdAsync(resourceId);
            if (resource == null)
            {
                return OperationResult<SumOfFilesResponse>.NotFound("Resource not found.");
            }

            var response = new SumOfFilesResponse
            {
                Size = resource.ToTalFileDownloadSize
            };

            return OperationResult<SumOfFilesResponse>.Ok(response);
        }

    }
}
