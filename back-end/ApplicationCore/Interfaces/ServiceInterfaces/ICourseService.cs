using System;
using System.Threading.Tasks;
using ApplicationCore.DTOs;
using ApplicationCore.Common;
using ApplicationCore.DTOs.Course;
namespace ApplicationCore.Interfaces
{
    public interface ICourseService
    {
        Task<OperationResult<CourseResponseDto>> CreateCourseAsync(CreateCourseRequestDto request);
        Task<OperationResult<CourseResponseDto>> UpdateCourseAsync(Guid courseId, CreateCourseRequestDto request);
        Task<OperationResult<CourseResponseDto>> DeleteCourseAsync(Guid courseId);
        Task<OperationResult<CourseResponseDto>> GetCourseByIdAsync(Guid courseId);
        Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(Guid courseId);
    }
}