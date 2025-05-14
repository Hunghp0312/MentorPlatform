using ApplicationCore.Common;
using ApplicationCore.DTOs;

namespace ApplicationCore.Interfaces.ServiceInterfaces
{
    public interface ICourseService
    {
        Task<OperationResult<CourseDetailsResponse>> GetCourseDetailsAsync(Guid courseId);
    }
}
