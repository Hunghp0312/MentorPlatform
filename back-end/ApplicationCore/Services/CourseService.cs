using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;
using ApplicationCore.DTOs.Course;
using ApplicationCore.DTOs.Category;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepo _courseRepo;
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(ICourseRepo courseRepo, IUnitOfWork unitOfWork)
        {
            _courseRepo = courseRepo;
            _unitOfWork = unitOfWork;
        }
        public async Task<OperationResult<CourseResponseDto>> CreateCourseAsync(CreateCourseRequestDto request)
        {

            var course = new Course
            {
                Title = request.Title,
                Description = request.Description,
                CategoryId = request.CategoryId,
                MentorId = Guid.Empty,
                Status = (CourseStatus)request.Status,
                Difficulty = (CourseDifficulty)request.Difficulty,
                Duration = request.Duration,
                Created = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            await _courseRepo.AddAsync(course);
            await _unitOfWork.SaveChangesAsync();

            var response = new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Category = new CategoryResponseDto
                {
                    Id = course.Category.Id,
                    Name = course.Category.Name,
                },
                Status = course.Status,
                Difficulty = course.Difficulty,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated
            };

            return OperationResult<CourseResponseDto>.Ok(response, "Course created successfully");
        }

        public async Task<OperationResult<CourseResponseDto>> GetCourseByIdAsync(Guid id)
        {
            var course = await _courseRepo.GetByIdAsync(id);
            if (course == null)
            {
                return OperationResult<CourseResponseDto>.NotFound($"Course with ID {id} not found");
            }

            var response = new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Category = new CategoryResponseDto
                {
                    Id = course.Category.Id,
                    Name = course.Category.Name,
                },
                Status = course.Status,
                Difficulty = course.Difficulty,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated
            };

            return OperationResult<CourseResponseDto>.Ok(response, "Course retrieved successfully");
        }

        public async Task<OperationResult<CourseResponseDto>> UpdateCourseAsync(Guid id, CreateCourseRequestDto request)
        {
            var course = await _courseRepo.GetByIdAsync(id);
            if (course == null)
            {
                return OperationResult<CourseResponseDto>.NotFound($"Course with ID {id} not found");
            }

            course.Title = request.Title;
            course.Description = request.Description;
            course.CategoryId = request.CategoryId;
            course.Status = (CourseStatus)request.Status;
            course.Difficulty = (CourseDifficulty)request.Difficulty;
            course.Duration = request.Duration;
            course.LastUpdated = DateTime.UtcNow;

            _courseRepo.Update(course);
            await _unitOfWork.SaveChangesAsync();

            var response = new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Category = new CategoryResponseDto
                {
                    Id = course.Category.Id,
                    Name = course.Category.Name,
                },
                Status = course.Status,
                Difficulty = course.Difficulty,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated
            };

            return OperationResult<CourseResponseDto>.Ok(response, "Course updated successfully");
        }

        public async Task<OperationResult<CourseResponseDto>> DeleteCourseAsync(Guid id)
        {
            var course = await _courseRepo.GetByIdAsync(id);
            if (course == null)
            {
                return OperationResult<CourseResponseDto>.NotFound($"Course with ID {id} not found");
            }

            _courseRepo.Delete(course);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<CourseResponseDto>.Ok("Course deleted successfully");
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
