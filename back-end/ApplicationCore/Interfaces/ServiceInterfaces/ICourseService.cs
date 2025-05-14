using ApplicationCore.Common;
using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICourseService
    {
        Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(Guid courseId);

        Task<OperationResult<PagedResult<CourseListResponse>>> GetPagedCourseAsync(
            CoursePagedRequest req
        );
    }
}
