using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;

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

        public async Task<CategoryResponseDto?> CreateCategoryAsync(CreateCategoryRequestDto createDto)
        {
            var trimmedName = createDto.Name?.Trim();
            var trimmedDescription = createDto.Description?.Trim();

            if (string.IsNullOrEmpty(trimmedName))
            {
                throw new ArgumentException("Category name cannot be empty.", nameof(createDto.Name));
            }
            if (string.IsNullOrEmpty(trimmedDescription))
            {
                throw new ArgumentException("Category description cannot be empty.", nameof(createDto.Description));
            }

            if (await _categoryRepo.ExistsByNameAsync(trimmedName))
            {
                throw new ArgumentException($"Category with name '{trimmedName}' already exists.");
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
            await _unitOfWork.CommitAsync();

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CourseCount = category.CourseCount
            };
        }

        public async Task<bool> UpdateCategoryAsync(Guid id, UpdateCategoryRequestDto updateDto)
        {
            var existingCategory = await _categoryRepo.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return false;
            }
            var trimmedName = updateDto.Name?.Trim();
            var trimmedDescription = updateDto.Description?.Trim();

            if (string.IsNullOrEmpty(trimmedName))
            {
                throw new ArgumentException("Category name cannot be empty.", nameof(updateDto.Name));
            }
            if (string.IsNullOrEmpty(trimmedDescription))
            {
                throw new ArgumentException("Category description cannot be empty.", nameof(updateDto.Description));
            }


            if (await _categoryRepo.ExistsByNameAsync(trimmedName, id))
            {
                throw new ArgumentException($"Category name '{trimmedName}' is already used by another category.");
            }

            existingCategory.Name = trimmedName;
            existingCategory.Description = trimmedDescription;
            existingCategory.Status = updateDto.Status;

            _categoryRepo.Update(existingCategory);
            var result = await _unitOfWork.CommitAsync();
            return result > 0;
        }
        public async Task<CategoryResponseDto?> GetCategoryByIdAsync(Guid id)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null)
            {
                return null;
            }

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CourseCount = category.CourseCount // Sử dụng trực tiếp nếu đã có trong entity
            };
        }

        public async Task<ICollection<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepo.GetAllAsync();
            var categoryDtos = categories.Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Status = c.Status,
                CourseCount = c.CourseCount
            }).ToList();

            return categoryDtos;
        }

        public async Task<PagedResult<CategoryResponseDto>> GetPagedCategoriesAsync(CategoryPagedRequestDto request)
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
                        bool isActive = request.Status.ToLower() == "active";
                        q = q.Where(c => c.Status == isActive);
                    }
                    return q;
                };
            }
            var (categories, totalCount) = await _categoryRepo.GetPagedAsync(filter, request.PageIndex, request.PageSize);
            return new PagedResult<CategoryResponseDto>(categories.Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Status = c.Status,
                CourseCount = c.CourseCount
            }).ToList(), request.PageIndex, request.PageSize, totalCount);

        }
    }
}
