using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;
using System.Net;

namespace ApplicationCore.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepo _categoryRepo;
        private readonly IUnitOfWork _unitOfWork; // Inject IUnitOfWork

        public CategoryService(ICategoryRepo categoryRepo, IUnitOfWork unitOfWork)
        {
            _categoryRepo = categoryRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryRequestDto createDto)
        {
            if (await _categoryRepo.ExistsByNameAsync(createDto.Name))
            {
                return OperationResult<CategoryResponseDto>.Conflict($"Category with name '{createDto.Name}' already exists.");
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

            var responseDto = new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CourseCount = category.CourseCount
            };

            return OperationResult<CategoryResponseDto>.Created(responseDto, "Category created successfully.");
        }

        public async Task<OperationResult<object>> UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto)
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

            existingCategory.Name = updateDto.Name;
            existingCategory.Description = updateDto.Description;
            existingCategory.Status = updateDto.Status;

            _categoryRepo.Update(existingCategory);
            var commitResult = await _unitOfWork.SaveChangesAsync();

            return commitResult > 0
                ? OperationResult<object>.Ok("Update category successfully.")
                : OperationResult<object>.Fail("Failed to update category.", HttpStatusCode.InternalServerError);
        }

        public async Task<OperationResult<CategoryResponseDto>> GetCategoryByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return OperationResult<CategoryResponseDto>.BadRequest("Category ID is not valid.");
            }
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null)
            {
                return OperationResult<CategoryResponseDto>.NotFound($"Category with ID '{id}' was not found.");
            }

            var responseDto = new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CourseCount = category.CourseCount
            };

            return OperationResult<CategoryResponseDto>.Ok(responseDto, "Get category successfully.");
        }


        public async Task<OperationResult<ICollection<CategoryResponseDto>>> GetAllCategoriesAsync()
        {

            var categories = await _categoryRepo.GetAllAsync();
            var categoryDtos = categories
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Status = c.Status,
                    CourseCount = c.CourseCount,
                })
                .ToList();
            string message = categoryDtos.Any()
                ? "Get list successfully"
                : "Operation successful but no categories found";

            return OperationResult<ICollection<CategoryResponseDto>>.Ok(categoryDtos, message);
        }


        public async Task<OperationResult<PagedResult<CategoryResponseDto>>> GetPagedCategoriesAsync(
    CategoryQueryParameters parameters
)
        {
            var request = new CategoryPagedRequestDto
            {
                Query = parameters.Query,
                Status = parameters.Status,
                PageIndex = parameters.Page,
                PageSize = parameters.PageSize
            };
            if (request.PageIndex < 1)
            {
                request.PageIndex = 1;
            }

            if (request.PageSize < 1 || request.PageSize > 20)
            {
                request.PageSize = 10;
            }

            Func<IQueryable<Category>, IQueryable<Category>> filter = null;
            if (!string.IsNullOrEmpty(request.Query) || !string.IsNullOrEmpty(request.Status))
            {
                filter = q =>
                {
                    if (!string.IsNullOrEmpty(request.Query))
                    {
                        q = q.Where(c => c.Name.Contains(request.Query) ||
                                        c.Description.Contains(request.Query));
                    }
                    if (!string.IsNullOrEmpty(request.Status))
                    {
                        if (Enum.TryParse(request.Status, true, out CategoryStatus isActive))
                            q = q.Where(c => c.Status == isActive);
                    }

                    return q;
                };
            }

            var (categories, totalCount) = await _categoryRepo.GetPagedAsync(
                filter,
                request.PageIndex,
                request.PageSize
            );

            var pagedResult = new PagedResult<CategoryResponseDto>(
                categories
                    .Select(c => new CategoryResponseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Status = c.Status,
                        CourseCount = c.CourseCount,
                    })
                    .ToList(),
                request.PageIndex,
                request.PageSize,
                totalCount
            );
            string message = totalCount > 0
                ? "Browsing categories successfully"
                : "Search completed successfully but no categories match your criteria";

            return OperationResult<PagedResult<CategoryResponseDto>>.Ok(pagedResult, message);
        }
    }
}
