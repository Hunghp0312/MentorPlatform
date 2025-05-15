using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICourseRepo _courseRepo;

        public CourseService(IUnitOfWork unitOfWork, ICourseRepo courseRepo)
        {
            _unitOfWork = unitOfWork;
            _courseRepo = courseRepo;
        }

        // public async Task<OperationResult<PagedResult<CourseListResponse>>> GetPagedCoursesAsync(
        //     CoursePagedRequestDto request
        // )
        // {
        //     var courses = await _courseRepo.GetPagedCoursesAsync(request);
        //     var totalCount = await _courseRepo.GetTotalCountAsync();

        //     var pagedResult = new PagedResult<CourseListResponse>
        //     {
        //         Items = courses,
        //         TotalCount = totalCount,
        //         PageNumber = request.PageNumber,
        //         PageSize = request.PageSize,
        //     };

        //     return new OperationResult<PagedResult<CourseListResponse>>
        //     {
        //         Success = true,
        //         Data = pagedResult,
        //     };
        // }

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
                CategoryName = "I am gay",
                Status = course.Status,
                Difficulty = course.Difficulty,
                Duration = course.Duration,
                CreatedAt = course.Created,
                LastUpdated = course.LastUpdated,
                MentorName = "Hiii",
                MentorInfo = "Demo",
                Resource = "Resouce",
            };

            return OperationResult<CourseDetailsResponse>.Ok(
                courseResponse,
                "Get course successfully"
            );
        }
    }
}
