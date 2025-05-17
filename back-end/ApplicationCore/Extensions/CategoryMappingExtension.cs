using ApplicationCore.DTOs.Category;
using ApplicationCore.Entity;

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
                Status = category.Status,
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

        public static Category ToCategoryEntity(this CreateCategoryRequest dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            return new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                Status = dto.Status,
            };
        }

        public static void MapToCategoryEntity(
            this UpdateCategoryRequest dto,
            Category existingCategory
        )
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }
            if (existingCategory == null)
            {
                throw new ArgumentNullException(nameof(existingCategory));
            }

            existingCategory.Name = dto.Name;
            existingCategory.Description = dto.Description;
            existingCategory.Status = dto.Status;
        }
    }
}
