using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Course;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.Entity;
using ApplicationCore.Extensions;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepo _courseRepo;
        private readonly ICategoryRepo _categoryRepo;
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(
            IUnitOfWork unitOfWork,
            ICourseRepo courseRepo,
            ICategoryRepo categoryRepo
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

            return OperationResult<GetCourseDetailsResponse>.Ok(
                response,
                "Course retrieved successfully"
            );
        }

        public async Task<
            OperationResult<ICollection<ListCourseResponse>>
        > GetCourseByMentorIdAsync(Guid mentorId)
        {
            var courses = await _courseRepo.GetCoursesByMentorId(mentorId);

            if (courses == null)
            {
                return OperationResult<ICollection<ListCourseResponse>>.NotFound(
                    "Courses not found"
                );
            }

            var response = courses.Select(CourseMappingExtension.CourseListResponseMap).ToList();
            return OperationResult<ICollection<ListCourseResponse>>.Ok(
                response,
                "Get course successfully"
            );
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
            course.Status = request.Status;
            course.Level = request.Level;
            course.Duration = request.Duration;
            course.LastUpdated = DateTime.UtcNow;
            course.Tags = TagHelper.ConvertListToString(request.Tags);

            _courseRepo.Update(course);
            await _unitOfWork.SaveChangesAsync();

            var response = course.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Ok(
                response,
                "Course updated successfully"
            );
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

        public async Task<OperationResult<PagedResult<ListCourseResponse>>> GetPagedCourseAsync(
            CourseQueryParameters req
        )
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
                .Select(CourseMappingExtension.CourseListResponseMap)
                .ToList();

            var coursesPageResponse = new PagedResult<ListCourseResponse>(
                CourseDetailsResponse,
                req.PageIndex,
                req.PageSize,
                totalCourses
            );

            return OperationResult<PagedResult<ListCourseResponse>>.Ok(
                coursesPageResponse,
                "Get list successfully"
            );
        }
    }
}
