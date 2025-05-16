using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<OperationResult<CategoryResponse>> CreateCategoryAsync(CreateCategoryRequest createDto);
        Task<OperationResult<object>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest updateDto);
        Task<OperationResult<CategoryResponse>> GetCategoryByIdAsync(Guid id);
        Task<OperationResult<ICollection<CategoryResponse>>> GetAllCategoriesAsync();
        Task<OperationResult<PagedResult<CategoryResponse>>> GetPagedCategoriesAsync(CategoryQueryParameters parameters);
        Task<OperationResult<object>> DeleteCategoryAsync(Guid id);
    }
}
