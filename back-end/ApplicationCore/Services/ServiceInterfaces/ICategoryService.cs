using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Categories;
using ApplicationCore.DTOs.Responses.Categories;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<OperationResult<CategoryResponse>> CreateCategoryAsync(CategoryRequest createDto);
        Task<OperationResult<object>> UpdateCategoryAsync(Guid id, CategoryRequest updateDto);
        Task<OperationResult<CategoryResponse>> GetCategoryByIdAsync(Guid id);
        Task<OperationResult<ICollection<CategoryResponse>>> GetAllCategoriesAsync();
        Task<OperationResult<PagedResult<CategoryResponse>>> GetPagedCategoriesAsync(CategoryQueryParameters parameters);
        Task<OperationResult<object>> DeleteCategoryAsync(Guid id);
    }
}
