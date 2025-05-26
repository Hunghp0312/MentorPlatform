using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IMentorService
    {
        Task<OperationResult<PagedResult<MentorApplicationDetailResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, string applicationStatus);

        Task<OperationResult<MentorApplicationResponseDto>> SubmitApplicationAsync(
           SubmitMentorApplicationApiRequest apiRequest, Guid applicantUserId
       );


    }
}