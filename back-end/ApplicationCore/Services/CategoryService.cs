﻿using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Categories;
using ApplicationCore.DTOs.Responses.Categories;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using System.Net;

namespace ApplicationCore.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepo;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(ICategoryRepository categoryRepo, IUnitOfWork unitOfWork)
        {
            _categoryRepo = categoryRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<CategoryResponse>> CreateCategoryAsync(
            CategoryRequest createDto
        )
        {
            if (await _categoryRepo.ExistsByNameAsync(createDto.Name))
            {
                return OperationResult<CategoryResponse>.Conflict(
                    $"Category with name '{createDto.Name}' already exists."
                );
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = createDto.Name,
                Description = createDto.Description,
                StatusId = createDto.StatusId,
            };

            await _categoryRepo.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            var newCreatedCategory = await _categoryRepo.GetByIdAsync(category.Id);
            var responseDto = newCreatedCategory?.ToCategoryResponseDto();

            return OperationResult<CategoryResponse>.Created(
                responseDto,
                "Category created successfully."
            );
        }

        public async Task<OperationResult<CategoryResponse>> UpdateCategoryAsync(
            Guid id,
            CategoryRequest updateDto
        )
        {
            if (id == Guid.Empty)
            {
                return OperationResult<CategoryResponse>.BadRequest("Category ID is not valid.");
            }

            var existingCategory = await _categoryRepo.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return OperationResult<CategoryResponse>.NotFound(
                    $"Category with ID '{id}' was not found."
                );
            }

            if (existingCategory.CourseCount != 0)
            {
                return OperationResult<CategoryResponse>.BadRequest(
                    $"Can not update category as it has associated courses"
                );
            }

            if (await _categoryRepo.ExistsByNameAsync(updateDto.Name, id))
            {
                return OperationResult<CategoryResponse>.Conflict(
                    $"Category name '{updateDto.Name}' is already used by another category."
                );
            }

            updateDto.MapToCategoryEntity(existingCategory);

            _categoryRepo.Update(existingCategory);
            var commitResult = await _unitOfWork.SaveChangesAsync();
            existingCategory = await _categoryRepo.GetByIdAsync(id);
            var responseDto = existingCategory!.ToCategoryResponseDto();

            return commitResult > 0
                ? OperationResult<CategoryResponse>.Ok(responseDto)
                : OperationResult<CategoryResponse>.Fail(
                    "Failed to update category.",
                    HttpStatusCode.InternalServerError
                );
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
                return OperationResult<CategoryResponse>.NotFound(
                    $"Category with ID '{id}' was not found."
                );
            }
            var responseDto = category.ToCategoryResponseDto();

            return OperationResult<CategoryResponse>.Ok(responseDto);
        }

        public async Task<OperationResult<ICollection<CategoryResponse>>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepo.GetAllAsync();
            var categoryDtos = categories.ToCategoryResponseDtoList();

            return OperationResult<ICollection<CategoryResponse>>.Ok(categoryDtos);
        }

        public async Task<OperationResult<PagedResult<CategoryResponse>>> GetPagedCategoriesAsync(
            CategoryQueryParameters parameters
        )
        {
            Func<IQueryable<Category>, IQueryable<Category>>? filter = null;
            if (!string.IsNullOrEmpty(parameters.Query) || parameters.Status.HasValue)
            {
                filter = q =>
                {
                    if (!string.IsNullOrEmpty(parameters.Query))
                    {
                        q = q.Where(c =>
                           (c.Name != null && c.Name.Contains(parameters.Query))
                            || (c.Description != null && c.Description.Contains(parameters.Query))
                        );
                    }
                    if (parameters.Status.HasValue)
                    {
                        q = q.Where(c => c.StatusId == parameters.Status);
                    }
                    q = q.OrderBy(c => c.Name);

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
                TotalItems = totalCount,
            };

            return OperationResult<PagedResult<CategoryResponse>>.Ok(pagedResult);
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
                return OperationResult<object>.BadRequest(
                    $"Cannot delete category '{categoryToDelete.Name}' as it has associated courses. Please remove or reassign courses first."
                );
            }

            var deletedByRepo = await _categoryRepo.DeleteById(id);
            if (!deletedByRepo)
            {
                return OperationResult<object>.NotFound(
                    $"Category with ID '{id}' was not found by repository for deletion."
                );
            }

            var commitResult = await _unitOfWork.SaveChangesAsync();

            return commitResult > 0
                ? OperationResult<object>.NoContent()
                : OperationResult<object>.Fail(
                    "Failed to delete category from database.",
                    HttpStatusCode.InternalServerError
                );
        }
    }
}
