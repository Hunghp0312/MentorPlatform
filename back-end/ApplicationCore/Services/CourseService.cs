using System;
using System.Threading.Tasks;
using ApplicationCore.DTOs;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using ApplicationCore.Interfaces.ServiceInterfaces;

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

        public async Task<CourseResponse> CreateCourseAsync(CreateCourseRequest request, Guid userId)
        {
            var course = new Course
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                CategoryId = request.CategoryId,
                Status = request.Status,
                Difficulty = request.Difficulty,
                Duration = request.Duration,
                Tags = request.Tags,
                Description = request.Description,
                Created = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,

            };

            await _courseRepo.AddAsync(course);
            await _unitOfWork.CommitAsync();

            return MapToResponse(course);
        }

        public async Task<CourseResponse> UpdateCourseAsync(Guid courseId, CreateCourseRequest request, Guid userId)
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
                throw new Exception("Course not found");

            course.Title = request.Title;
            course.CategoryId = request.CategoryId;
            course.Status = request.Status;
            course.Difficulty = request.Difficulty;
            course.Duration = request.Duration;
            course.Tags = request.Tags;
            course.Description = request.Description;
            course.LastUpdated = DateTime.UtcNow;

            _courseRepo.Update(course);
            await _unitOfWork.CommitAsync();

            return MapToResponse(course);
        }

        public async Task DeleteCourseAsync(Guid courseId, Guid userId)
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
                throw new Exception("Course not found");

            _courseRepo.Delete(course);
            await _unitOfWork.CommitAsync();
        }

        public async Task<CourseResponse> GetCourseByIdAsync(Guid courseId)
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
                return null;

            return MapToResponse(course);
        }

        private static CourseResponse MapToResponse(Course course)
        {
            return new CourseResponse
            {
                Id = course.Id,
                CategoryId = course.CategoryId,
                Status = course.Status,
                Difficulty = course.Difficulty,
                Title = course.Title,
                Duration = course.Duration,
                Created = course.Created,
                LastUpdated = course.LastUpdated,
                Tags = course.Tags.ToList(),
                Description = course.Description
            };
        }
    }
}