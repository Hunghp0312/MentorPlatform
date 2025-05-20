using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(
            IUnitOfWork unitOfWork,
            ICourseRepository courseRepo,
            ICategoryRepository categoryRepo
        )
        {
            _courseRepo = courseRepo;
            _categoryRepo = categoryRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> CreateCourseAsync(
            CreateCourseRequest request
        )
        {
            var category = await _categoryRepo.GetByIdAsync(request.CategoryId);

            if (category == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound("Category not found");
            }

            var course = request.ToCourseEntity();

            await _courseRepo.AddAsync(course);
            await _unitOfWork.SaveChangesAsync();

            var response = course.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Created(
                response,
                "Course created successfully"
            );
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> GetCourseDetailsByIdAsync(
            Guid courseId
        )
        {
            var course = await _courseRepo.GetCourseWithCategoryAsync(courseId);
            if (course == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }

            var response = course.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Ok(response);
        }

        public async Task<
            OperationResult<ICollection<GetCourseDetailsResponse>>
        > GetCourseByMentorIdAsync(Guid mentorId)
        {
            var courses = await _courseRepo.GetCoursesByMentorId(mentorId);

            if (courses == null)
            {
                return OperationResult<ICollection<GetCourseDetailsResponse>>.NotFound(
                    "Courses not found"
                );
            }

            var response = courses.Select(CourseMappingExtension.CourseDetailResponseMap).ToList();
            return OperationResult<ICollection<GetCourseDetailsResponse>>.Ok(response);
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> UpdateCourseAsync(
            Guid courseId,
            CreateCourseRequest request
        )
        {
            var category = await _categoryRepo.GetByIdAsync(request.CategoryId);

            if (category == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound("Category not found");
            }

            var course = await _courseRepo.GetCourseWithCategoryAsync(courseId);
            if (course == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }

            course.Title = request.Title;
            course.Description = request.Description;
            course.CategoryId = request.CategoryId;
            course.StatusId = request.StatusId;
            course.LevelId = request.LevelId;
            course.Duration = request.Duration;
            course.LastUpdated = DateTime.UtcNow;
            course.Tags = TagHelper.ConvertListToString(request.Tags);

            _courseRepo.Update(course);
            await _unitOfWork.SaveChangesAsync();

            var response = course.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Ok(response);
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> DeleteCourseAsync(
            Guid courseId
        )
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }

            _courseRepo.Delete(course);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<GetCourseDetailsResponse>.NoContent();
        }

        public async Task<
            OperationResult<PagedResult<GetCourseDetailsResponse>>
        > GetPagedCourseAsync(CourseQueryParameters req)
        {
            if (req.PageIndex < 1)
                req.PageIndex = 1;

            if (req.PageSize < 1 || req.PageSize > 20)
                req.PageSize = 10;

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
                    query = query.Where(c => c.LevelId == req.Level);
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
                .Select(CourseMappingExtension.CourseDetailResponseMap)
                .ToList();

            var coursesPageResponse = new PagedResult<GetCourseDetailsResponse>
            {
                Items = CourseDetailsResponse,
                PageIndex = req.PageIndex,
                PageSize = req.PageSize,
                TotalItems = totalCourses,
            };

            return OperationResult<PagedResult<GetCourseDetailsResponse>>.Ok(coursesPageResponse);
        }
    }
}
