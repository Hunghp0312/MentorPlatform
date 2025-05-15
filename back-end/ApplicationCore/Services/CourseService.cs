using System.Runtime.InteropServices.Marshalling;
using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Course;
using ApplicationCore.Entity;
using ApplicationCore.Extensions;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;
using ApplicationCore.Validators;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepo _courseRepo;
        private readonly ICategoryRepo _categoryRepo;
        private readonly CoursePageListValidator _coursePageListValidator;
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(
            IUnitOfWork unitOfWork,
            ICourseRepo courseRepo,
            ICategoryRepo categoryRepo,
            CoursePageListValidator coursePageListValidator
        )
        {
            _courseRepo = courseRepo;
            _categoryRepo = categoryRepo;
            _unitOfWork = unitOfWork;
            _coursePageListValidator = coursePageListValidator;
        }

        public async Task<OperationResult<CourseDetailsResponse>> CreateCourseAsync(
            CreateCourseRequestDto request
        )
        {
            var category = await _categoryRepo.GetByIdAsync(request.CategoryId);

            if (category == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound("Category not found");
            }

            var course = new Course
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                CategoryId = request.CategoryId,
                //MentorId = Guid.Empty,
                Status = request.Status,
                Level = request.Level,
                Duration = request.Duration,
                Created = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                Tags = TagHelper.ConvertListToString(request.Tags),
            };

            await _courseRepo.AddAsync(course);
            await _unitOfWork.SaveChangesAsync();

            var response = CourseMappingExtension.CourseDetailResponseMap(course);

            return OperationResult<CourseDetailsResponse>.Ok(
                response,
                "Course created successfully"
            );
        }

        public async Task<OperationResult<CourseDetailsResponse>> GetCourseByIdAsync(Guid id)
        {
            var course = await _courseRepo.GetCourseWithCategoryAsync(id);
            if (course == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound(
                    $"Course with ID {id} not found"
                );
            }

            var response = CourseMappingExtension.CourseDetailResponseMap(course);

            return OperationResult<CourseDetailsResponse>.Ok(
                response,
                "Course retrieved successfully"
            );
        }

        public async Task<
            OperationResult<ICollection<CourseListResponse>>
        > GetCourseByMentorIdAsync(Guid mentorId)
        {
            var courses = await _courseRepo.GetCoursesByMentorId(mentorId);

            if (courses == null)
            {
                return OperationResult<ICollection<CourseListResponse>>.NotFound(
                    "Courses not found"
                );
            }

            var response = courses
                .Select(course => CourseMappingExtension.CourseListResponseMap(course))
                .ToList();
            return OperationResult<ICollection<CourseListResponse>>.Ok(
                response,
                "Get course successfully"
            );
        }

        public async Task<OperationResult<CourseDetailsResponse>> UpdateCourseAsync(
            Guid id,
            CreateCourseRequestDto request
        )
        {
            var category = await _categoryRepo.GetByIdAsync(request.CategoryId);

            if (category == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound("Category not found");
            }

            var course = await _courseRepo.GetCourseWithCategoryAsync(id);
            if (course == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound(
                    $"Course with ID {id} not found"
                );
            }

            course.Title = request.Title;
            course.Description = request.Description;
            course.CategoryId = request.CategoryId;
            course.Status = (CourseStatus)request.Status;
            course.Level = request.Level;
            course.Duration = request.Duration;
            course.LastUpdated = DateTime.UtcNow;
            course.Tags = TagHelper.ConvertListToString(request.Tags);

            _courseRepo.Update(course);
            await _unitOfWork.SaveChangesAsync();

            var response = new CourseDetailsResponse
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                CategoryName = course.Category.Name,
                Status = course.Status,
                Level = course.Level,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated,
                Tags = TagHelper.ConvertStringToList(course.Tags),
            };

            return OperationResult<CourseDetailsResponse>.Ok(
                response,
                "Course updated successfully"
            );
        }

        public async Task<OperationResult<CourseDetailsResponse>> DeleteCourseAsync(Guid id)
        {
            var course = await _courseRepo.GetByIdAsync(id);
            if (course == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound(
                    $"Course with ID {id} not found"
                );
            }

            _courseRepo.Delete(course);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<CourseDetailsResponse>.Ok("Course deleted successfully");
        }

        public async Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(
            Guid courseId
        )
        {
            var course = await _courseRepo.GetCourseWithCategoryAsync(courseId);
            if (course == null)
            {
                return OperationResult<CourseDetailsResponse>.NotFound("There is no course");
            }

            var courseResponse = new CourseDetailsResponse
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                CategoryName = course.Category.Name,
                Status = course.Status,
                Level = course.Level,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated,
                Tags = TagHelper.ConvertStringToList(course.Tags),
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

                if (req.MentorId.HasValue)
                {
                    query = query.Where(c => c.MentorId == req.MentorId);
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

            var CourseDetailsResponse = courses
                .Select(course => new CourseListResponse
                {
                    Id = course.Id,
                    Title = course.Title,
                    CategoryName = course.Category.Name,
                    Status = course.Status,
                    Difficulty = course.Level,
                    Duration = course.Duration,
                    Tags = TagHelper.ConvertStringToList(course.Tags),
                })
                .ToList();

            var coursesPageResponse = new PagedResult<CourseListResponse>(
                CourseDetailsResponse,
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
