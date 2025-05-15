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
            Guid Id,
            UpdateCourseRequestDto request
        );
        Task<OperationResult<CourseDetailsResponse>> DeleteCourseAsync(Guid Id);
        Task<OperationResult<CourseDetailsResponse>> GetCourseByIdAsync(Guid Id);
        Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(Guid Id);

        Task<OperationResult<PagedResult<CourseListResponse>>> GetPagedCourseAsync(
            CoursePagedRequest req
        );
    }
}