using System;
using System.Threading.Tasks;
using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Course;
using ApplicationCore.DTOs.QueryParameters;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICourseService
    {
        Task<OperationResult<GetCourseDetailsResponse>> CreateCourseAsync(
            CreateCourseRequest request
        );
        Task<OperationResult<GetCourseDetailsResponse>> UpdateCourseAsync(
            Guid courseId,
            CreateCourseRequest request
        );
        Task<OperationResult<GetCourseDetailsResponse>> DeleteCourseAsync(Guid courseId);
        Task<OperationResult<GetCourseDetailsResponse>> GetCourseDetailsByIdAsync(Guid courseId);
        Task<OperationResult<ICollection<ListCourseResponse>>> GetCourseByMentorIdAsync(
            Guid mentorId
        );
        Task<OperationResult<PagedResult<ListCourseResponse>>> GetPagedCourseAsync(
            CourseQueryParameters req
        );
    }
}
