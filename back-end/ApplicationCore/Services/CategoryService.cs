using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.Entity;
using ApplicationCore.Extensions;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;
using System.Net;

namespace ApplicationCore.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepo _categoryRepo;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(ICategoryRepo categoryRepo, IUnitOfWork unitOfWork)
        {
            _categoryRepo = categoryRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<CategoryResponse>> CreateCategoryAsync(CategoryRequest createDto)
        {
            if (await _categoryRepo.ExistsByNameAsync(createDto.Name))
            {
                return OperationResult<CategoryResponse>.Conflict($"Category with name '{createDto.Name}' already exists.");
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = createDto.Name,
                Description = createDto.Description,
                Status = createDto.Status,
            };

            await _categoryRepo.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            var responseDto = category.ToCategoryResponseDto();

            return OperationResult<CategoryResponse>.Created(responseDto, "Category created successfully.");
        }

        public async Task<OperationResult<object>> UpdateCategoryAsync(Guid id, CategoryRequest updateDto)
        {
            if (id == Guid.Empty)
            {
                return OperationResult<object>.BadRequest("Category ID is not valid.");
            }

            var existingCategory = await _categoryRepo.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return OperationResult<object>.NotFound($"Category with ID '{id}' was not found.");
            }

            if (await _categoryRepo.ExistsByNameAsync(updateDto.Name, id))
            {
                return OperationResult<object>.Conflict($"Category name '{updateDto.Name}' is already used by another category.");
            }
            updateDto.MapToCategoryEntity(existingCategory);

            _categoryRepo.Update(existingCategory);
            var commitResult = await _unitOfWork.SaveChangesAsync();
            var responseDto = existingCategory.ToCategoryResponseDto();

            return commitResult > 0
                ? OperationResult<object>.Ok(responseDto, "Update category successfully.")
                : OperationResult<object>.Fail("Failed to update category.", HttpStatusCode.InternalServerError);
        }

        public async Task<OperationResult<CategoryResponse>> GetCategoryByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return OperationResult<CategoryResponse>.BadRequest("Category ID is not valid.");
            }
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null)
            {
                return OperationResult<CategoryResponse>.NotFound($"Category with ID '{id}' was not found.");
            }
            var responseDto = category.ToCategoryResponseDto();

            return OperationResult<CategoryResponse>.Ok(responseDto, "Get category successfully.");
        }


        public async Task<OperationResult<ICollection<CategoryResponse>>> GetAllCategoriesAsync()
        {

            var categories = await _categoryRepo.GetAllAsync();
            var categoryDtos = categories.ToCategoryResponseDtoList();
            string message = categoryDtos.Any()
                ? "Get list successfully"
                : "Operation successful but no categories found";

            return OperationResult<ICollection<CategoryResponse>>.Ok(categoryDtos, message);
        }


        public async Task<OperationResult<PagedResult<CategoryResponse>>> GetPagedCategoriesAsync(
    CategoryQueryParameters parameters
)
        {
            Func<IQueryable<Category>, IQueryable<Category>>? filter = null;
            if (!string.IsNullOrEmpty(parameters.Query) || !string.IsNullOrEmpty(parameters.Status))
            {
                filter = q =>
                {
                    if (!string.IsNullOrEmpty(parameters.Query))
                    {
                        q = q.Where(c => c.Name.Contains(parameters.Query) ||
                                        c.Description.Contains(parameters.Query));
                    }
                    if (!string.IsNullOrEmpty(parameters.Status) && Enum.TryParse(parameters.Status, true, out CategoryStatus isActive))
                    {
                        q = q.Where(c => c.Status == isActive);
                    }
                    return q;
                };
            }
            var (categories, totalCount) = await _categoryRepo.GetPagedAsync(
        filter,
        parameters.PageIndex,
        parameters.PageSize
    );
            var pagedResult = new PagedResult<CategoryResponse>
            {
                Items = categories.ToCategoryResponseDtoList(),
                PageIndex = parameters.PageIndex,
                PageSize = parameters.PageSize,
                TotalItems = totalCount
            };
            string message = totalCount > 0
                ? "Browsing categories successfully"
                : "Search completed successfully but no categories match your criteria";

            return OperationResult<PagedResult<CategoryResponse>>.Ok(pagedResult, message);
        }

        public async Task<OperationResult<object>> DeleteCategoryAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return OperationResult<object>.BadRequest("Category ID is not valid.");
            }

            var categoryToDelete = await _categoryRepo.GetByIdAsync(id);

            if (categoryToDelete == null)
            {
                return OperationResult<object>.NotFound($"Category with ID '{id}' was not found.");
            }

            if (categoryToDelete.Courses != null && categoryToDelete.Courses.Any())
            {
                return OperationResult<object>.Conflict($"Cannot delete category '{categoryToDelete.Name}' as it has associated courses. Please remove or reassign courses first.");
            }

            var deletedByRepo = await _categoryRepo.DeleteById(id);
            if (!deletedByRepo)
            {
                return OperationResult<object>.NotFound($"Category with ID '{id}' was not found by repository for deletion.");
            }

            var commitResult = await _unitOfWork.SaveChangesAsync();

            return commitResult > 0
                ? OperationResult<object>.NoContent()
                : OperationResult<object>.Fail("Failed to delete category from database.", HttpStatusCode.InternalServerError);
        }
    }
}
