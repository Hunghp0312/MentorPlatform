using System;
using System.Threading.Tasks;
using ApplicationCore.DTOs;

namespace ApplicationCore.Interfaces
{
    public interface ICourseService
    {
        Task<CourseResponse> CreateCourseAsync(CreateCourseRequest request, Guid userId);
        Task<CourseResponse> UpdateCourseAsync(Guid courseId, CreateCourseRequest request, Guid userId);
        Task DeleteCourseAsync(Guid courseId, Guid userId);
        Task<CourseResponse> GetCourseByIdAsync(Guid courseId);
    }
}