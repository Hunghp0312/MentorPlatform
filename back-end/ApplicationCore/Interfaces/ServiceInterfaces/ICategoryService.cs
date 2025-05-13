using ApplicationCore.DTOs.Category;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto?> CreateCategoryAsync(CreateCategoryRequestDto createDto);
        Task<bool> UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto);
        Task<CategoryResponseDto?> GetCategoryByIdAsync(Guid id);
    }
}
