using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IMentorService
    {
        Task<OperationResult<PagedResult<MetorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, string applicatioStatus);

        Task<OperationResult<MentorApplicationResponseDto>> SubmitApplicationAsync(
           SubmitMentorApplicationApiRequest apiRequest, Guid applicantUserId
       );
        //Task<OperationResult<MentorApplicationResponseDto>> GetMyApplicationAsync(Guid applicantUserId);


    }
}