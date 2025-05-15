using System;
using System.Threading.Tasks;
using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Course;

namespace ApplicationCore.Interfaces
{
    public interface ICourseService
    {
        Task<OperationResult<CourseDetailsResponse>> CreateCourseAsync(
            CreateCourseRequestDto request
        );
        Task<OperationResult<CourseDetailsResponse>> UpdateCourseAsync(
            Guid courseId,
            CreateCourseRequestDto request
        );
        Task<OperationResult<CourseDetailsResponse>> DeleteCourseAsync(Guid courseId);
        Task<OperationResult<CourseDetailsResponse>> GetCourseByIdAsync(Guid courseId);
        Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(Guid courseId);
        Task<OperationResult<ICollection<CourseListResponse>>> GetCourseByMentorId(Guid mentorId);
        Task<OperationResult<PagedResult<CourseListResponse>>> GetPagedCourseAsync(
            CoursePagedRequest req
        );
    }
}
