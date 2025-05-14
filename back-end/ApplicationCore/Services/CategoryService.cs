using ApplicationCore.Common;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
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
            if (createDto == null)
            {
                return OperationResult<CategoryResponseDto>.BadRequest("Input DTO cannot be null.");
            }

            var trimmedName = createDto.Name?.Trim();
            var trimmedDescription = createDto.Description?.Trim();

            if (await _categoryRepo.ExistsByNameAsync(trimmedName))
            {
                return OperationResult<CategoryResponseDto>.Conflict($"Category with name '{trimmedName}' already exists.");
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = trimmedName,
                Description = trimmedDescription,
                Status = createDto.Status,
                CourseCount = 0
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
            if (updateDto == null)
            {
                return OperationResult<object>.BadRequest("Input DTO cannot be null.");
            }
            if (id == Guid.Empty)
            {
                return OperationResult<object>.BadRequest("Category ID is not valid.");
            }

            var trimmedName = updateDto.Name?.Trim();
            var trimmedDescription = updateDto.Description?.Trim();

            var existingCategory = await _categoryRepo.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return OperationResult<object>.NotFound($"Category with ID '{id}' was not found.");
            }

            if (await _categoryRepo.ExistsByNameAsync(trimmedName, id))
            {
                return OperationResult<object>.Conflict($"Category name '{trimmedName}' is already used by another category.");
            }

            existingCategory.Name = trimmedName;
            existingCategory.Description = trimmedDescription;
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
            return OperationResult<CategoryResponseDto>.Ok(responseDto);
        }

        public async Task<ICollection<CategoryResponseDto>> GetAllCategoriesAsync()
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

            return categoryDtos;
        }

        public async Task<PagedResult<CategoryResponseDto>> GetPagedCategoriesAsync(
            CategoryPagedRequestDto request
        )
        {
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
                        q = q.Where(c => c.Name.ToLower().Contains(request.Query));
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
            return new PagedResult<CategoryResponseDto>(
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
        }
    }
}
