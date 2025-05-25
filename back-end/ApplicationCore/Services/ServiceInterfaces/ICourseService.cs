using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ICourseService
    {
        Task<OperationResult<GetCourseDetailsResponse>> CreateCourseAsync(
            CreateUpdateCourseRequest request
        );
        Task<OperationResult<GetCourseDetailsResponse>> UpdateCourseAsync(
            Guid courseId,
            CreateUpdateCourseRequest request
        );
        Task<OperationResult<GetCourseDetailsResponse>> DeleteCourseAsync(Guid courseId);
        Task<OperationResult<GetCourseDetailsResponse>> GetCourseDetailsByIdAsync(Guid courseId);
        Task<OperationResult<ICollection<GetCourseDetailsResponse>>> GetCourseByMentorIdAsync(
            Guid mentorId
        );
        Task<OperationResult<PagedResult<GetCourseDetailsResponse>>> GetPagedCourseAsync(
            CourseQueryParameters req
        );
    }
}