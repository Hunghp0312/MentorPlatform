using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<OperationResult<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryRequestDto createDto);
        Task<OperationResult<object>> UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto);
        Task<OperationResult<CategoryResponseDto>> GetCategoryByIdAsync(Guid id);
        Task<ICollection<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<PagedResult<CategoryResponseDto>> GetPagedCategoriesAsync(
            CategoryPagedRequestDto request
        );
    }
}
