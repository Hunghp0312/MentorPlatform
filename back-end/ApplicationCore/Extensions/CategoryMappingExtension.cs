﻿using ApplicationCore.DTOs.Requests.Categories;
using ApplicationCore.DTOs.Responses.Categories;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class CategoryMappingExtension
    {
        public static CategoryResponse ToCategoryResponseDto(this Category category)
        {
            if (category == null)
            {
                return null!;
            }

            return new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status!,
                CourseCount = category.CourseCount,
            };
        }

        public static List<CategoryResponse> ToCategoryResponseDtoList(
            this IEnumerable<Category> categories
        )
        {
            if (categories == null)
            {
                return new List<CategoryResponse>();
            }

            return categories.Select(c => c.ToCategoryResponseDto()).ToList();
        }

        public static Category ToCategoryEntity(this CategoryRequest dto)
        {
            return new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                StatusId = dto.StatusId,
            };
        }

        public static CourseCategoryResponse ToCourseCategory(this Category category)
        {
            return new CourseCategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
            };
        }

        public static void MapToCategoryEntity(this CategoryRequest dto, Category existingCategory)
        {
            existingCategory.Name = dto.Name;
            existingCategory.Description = dto.Description;
            existingCategory.StatusId = dto.StatusId;
        }
    }
}
