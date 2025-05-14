using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto?> CreateCategoryAsync(CreateCategoryRequestDto createDto);
        Task UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto);
        Task<CategoryResponseDto?> GetCategoryByIdAsync(Guid id);
        Task<OperationResult<ICollection<CategoryResponseDto>>> GetAllCategoriesAsync();
        Task<OperationResult<PagedResult<CategoryResponseDto>>> GetPagedCategoriesAsync(CategoryQueryParameters parameters);
    }
}
