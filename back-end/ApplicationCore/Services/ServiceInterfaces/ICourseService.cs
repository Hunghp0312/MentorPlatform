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
            CreateUpdateCourseRequest request,
            Guid userId,
            string role
        );
        Task<OperationResult<GetCourseDetailsResponse>> UpdateCourseAsync(
            Guid courseId,
            CreateUpdateCourseRequest request
        );
        Task<OperationResult<GetCourseDetailsResponse>> DeleteCourseAsync(Guid courseId);
        Task<OperationResult<CourseDetailResponse>> GetCourseDetailsByIdAsync(Guid courseId, Guid learnerId);
        Task<OperationResult<ICollection<GetCourseDetailsResponse>>> GetCourseByMentorIdAsync(
            Guid mentorId
        );
        Task<OperationResult<PagedResult<GetCourseDetailsResponse>>> GetPagedCourseAsync(
            CourseQueryParameters req, Guid id
        );
        Task<OperationResult<MessageResponse>> EnrollCourse(Guid courseId, Guid userId);
        Task<OperationResult<MessageResponse>> FinishCourse(Guid courseId, Guid userId);
        Task<OperationResult<MessageResponse>> AssignCourse(Guid courseId, Guid mentorId);
        Task<OperationResult<CourseDashboardDto>> GetCourseDashBoardAsync(Guid mentorId, PaginationParameters paginationParameters);
        Task<OperationResult<PagedResult<GetCourseDetailsResponse>>> GetCourseLearnerEnroll(Guid learnerId, CourseQueryParameters courseQueryParameters);
    }
}