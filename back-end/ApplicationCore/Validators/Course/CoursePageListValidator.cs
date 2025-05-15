using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Interfaces.RepositoryInterfaces;

namespace ApplicationCore.Validators
{
    public class CoursePageListValidator
    {
        private readonly ICategoryRepo _categoryRepo;

        public CoursePageListValidator(ICategoryRepo categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<OperationResult<PagedResult<CourseListResponse>>> ValidateAsync(
            CoursePagedRequest req
        )
        {
            // Normalize pagination
            if (req.PageIndex < 1)
                req.PageIndex = 1;

            if (req.PageSize < 1 || req.PageSize > 20)
                req.PageSize = 10;

            // Validate course level if provided
            if (req.Level.HasValue && !Enum.IsDefined(typeof(CourseLevel), req.Level.Value))
            {
                return OperationResult<PagedResult<CourseListResponse>>.BadRequest(
                    "Invalid course level."
                );
            }

            // Validate category existence
            if (req.CategoryId.HasValue && req.CategoryId.Value != Guid.Empty)
            {
                var category = await _categoryRepo.GetByIdAsync(req.CategoryId.Value);
                if (category == null)
                {
                    return OperationResult<PagedResult<CourseListResponse>>.NotFound(
                        "Category not found."
                    );
                }
            }

            return OperationResult<PagedResult<CourseListResponse>>.Ok();
        }
    }
}
