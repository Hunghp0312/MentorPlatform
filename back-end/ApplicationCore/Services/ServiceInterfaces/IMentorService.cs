using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IMentorService
    {
        Task<OperationResult<PagedResult<MentorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, int applicatioStatus, string? searchString = null);
        Task<OperationResult<MentorApplicantResponse>> UpdateMentorApplicationStatus(MentorUpdateStatusRequest request);
        Task<OperationResult<MentorApplicationResponseDto>> SubmitApplicationAsync(
           SubmitMentorApplicationApiRequest apiRequest
       );
    }
}