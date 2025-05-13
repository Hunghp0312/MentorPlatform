using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto?> CreateCategoryAsync(CreateCategoryRequestDto createDto);
        Task<bool> UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto);
        Task<CategoryResponseDto?> GetCategoryByIdAsync(Guid id);
        Task<ICollection<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<PagedResult<CategoryResponseDto>> GetPagedCategoriesAsync(CategoryPagedRequestDto request);
    }
}
