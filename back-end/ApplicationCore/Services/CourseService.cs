using System.Runtime.InteropServices.Marshalling;
using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;
using ApplicationCore.Validators;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICourseRepo _courseRepo;
        private readonly ICategoryRepo _categoryRepo;
        private readonly CoursePageListValidator _coursePageListValidator;

        public CourseService(
            IUnitOfWork unitOfWork,
            ICourseRepo courseRepo,
            ICategoryRepo categoryRepo,
            CoursePageListValidator coursePageListValidator
        )
        {
            _unitOfWork = unitOfWork;
            _courseRepo = courseRepo;
            _categoryRepo = categoryRepo;
            _coursePageListValidator = coursePageListValidator;
        }

        public async Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(
            Guid courseId
        )
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound("There is no course");
            }

            var courseResponse = new CourseDetailsResponse
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Status = course.Status,
                Difficulty = course.Level,
                Duration = course.Duration,
                CreatedAt = course.Created,
                LastUpdated = course.LastUpdated,
            };

            return OperationResult<CourseDetailsResponse>.Ok(
                courseResponse,
                "Get course successfully"
            );
        }

        public async Task<OperationResult<PagedResult<CourseListResponse>>> GetPagedCourseAsync(
            CoursePagedRequest req
        )
        {
            var validator = await _coursePageListValidator.ValidateAsync(req);

            if (!validator.Success)
            {
                return validator;
            }

            Func<IQueryable<Course>, IQueryable<Course>> filter = query =>
            {
                if (!string.IsNullOrWhiteSpace(req.Query))
                {
                    query = query.Where(c =>
                        c.Title.Contains(req.Query) || c.Description.Contains(req.Query)
                    );
                }

                if (req.Level.HasValue)
                {
                    query = query.Where(c => c.Level == req.Level.Value);
                }

                if (req.CategoryId.HasValue && req.CategoryId.Value != Guid.Empty)
                {
                    query = query.Where(c => c.CategoryId == req.CategoryId.Value);
                }

                return query;
            };

            var (courses, totalCourses) = await _courseRepo.GetPagedCoursesAsync(
                filter,
                req.PageIndex,
                req.PageSize
            );

            var courseResponses = courses
                .Select(course => new CourseListResponse
                {
                    Id = course.Id,
                    Title = course.Title,
                    CategoryName = course.Category.Name,
                    Status = course.Status,
                    Difficulty = course.Level,
                    Duration = course.Duration,
                })
                .ToList();

            var coursesPageResponse = new PagedResult<CourseListResponse>(
                courseResponses,
                req.PageIndex,
                req.PageSize,
                totalCourses
            );

            return OperationResult<PagedResult<CourseListResponse>>.Ok(
                coursesPageResponse,
                "Get list successfully"
            );
        }
    }
}
