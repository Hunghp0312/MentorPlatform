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
            // ✅ Sử dụng transaction để đảm bảo atomicity
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var file = await _documentContentRepository.GetByIdAsync(fileId);
                if (file == null)
                {
                    return OperationResult<FileDownloadDto>.NotFound("File not found.");
                }

                var resource = await _resourceRepository.GetByDocumentContentIdAsync(fileId);
                if (resource != null)
                {
                    // ✅ Luôn tạo download record mới (nếu muốn track mọi lần download)
                    // Hoặc thêm logic kiểm tra duplicate nếu cần
                    {
                        // ✅ Tạo ResourceDownload trước
                        var resourceDownload = new ResourceDownload
                        {
                            Id = Guid.NewGuid(),
                            ResourceId = resource.Id,
                            DocumentContentId = fileId,
                            FileSize = file.FileContent.LongLength,
                        };

                        await _resourceDownloadRepository.AddAsync(resourceDownload);

                        // ✅ Cập nhật DownloadCount
                        resource.DownloadCount += 1;
                        await _resourceRepository.UpdateAsync(resource);

                        // ✅ Save changes một lần
                        await _unitOfWork.SaveChangesAsync();
                    }
                }

                // ✅ Commit transaction
                await _unitOfWork.CommitAsync();

                var fileDownloadDto = new FileDownloadDto
                {
                    Content = file.FileContent,
                    ContentType = file.FileType,
                    FileName = file.FileName
                };

                return OperationResult<FileDownloadDto>.Ok(fileDownloadDto);
            }
            catch (Exception ex)
            {
                // ✅ Rollback nếu có lỗi
                await _unitOfWork.RollbackAsync();

                // Log exception
                // _logger.LogError(ex, "Error downloading file {FileId} for user {UserId}", fileId, userId);

                return OperationResult<FileDownloadDto>.Fail("An error occurred while downloading the file.");
            }
        }

    }
}
