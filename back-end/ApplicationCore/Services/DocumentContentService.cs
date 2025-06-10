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
        private readonly IResourceDownloadRepository _resourceDownloadRepository;
        private readonly IUnitOfWork _unitOfWork;
        public DocumentContentService(
            IUnitOfWork unitOfWork,
            IDocumentContentRepository documentContentRepository, IResourceRepository resourceRepository, IResourceDownloadRepository resourceDownloadRepository)
        {
            _documentContentRepository = documentContentRepository;
            _resourceRepository = resourceRepository;
            _resourceDownloadRepository = resourceDownloadRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<SumOfFilesResponse>> CalculateTotalDownloadSizeInMBAsync()
        {
            var totalBytes = await _resourceDownloadRepository.GetAllAsync();
            var totalSizeInMB = totalBytes.Sum(x => x.FileSize) / BytesToMB;

            return OperationResult<SumOfFilesResponse>.Ok(new SumOfFilesResponse
            {
                Size = totalSizeInMB
            });
        }

        public async Task<OperationResult<SumOfFilesResponse>> CalculateTotalDownloadSizeFormattedAsync()
        {
            var result = await CalculateTotalDownloadSizeInMBAsync();

            var formattedSize = Math.Round(result.Data.Size, 2);

            return OperationResult<SumOfFilesResponse>.Ok(new SumOfFilesResponse
            {
                Size = formattedSize
            });
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
