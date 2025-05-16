using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<OperationResult<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryRequestDto createDto);
        Task<OperationResult<object>> UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto);
        Task<OperationResult<CategoryResponseDto>> GetCategoryByIdAsync(Guid id);
        Task<OperationResult<ICollection<CategoryResponseDto>>> GetAllCategoriesAsync();
        Task<OperationResult<PagedResult<CategoryResponseDto>>> GetPagedCategoriesAsync(CategoryQueryParameters parameters);
        Task<OperationResult<object>> DeleteCategoryAsync(Guid id);
    }
}
