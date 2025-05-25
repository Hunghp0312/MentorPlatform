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
           SubmitMentorApplicationApiRequest apiRequest
       );
        //Task<OperationResult<MentorApplicationResponseDto>> GetMyApplicationAsync(Guid applicantUserId);


        Task<OperationResult<PagedResult<MetorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, int applicatioStatus,string? searchString = null);
        Task<OperationResult<MetorApplicantResponse>> UpdateMentorApplicationStatus(Guid mentorId, int statusId, string? adminComments = null);
    }
}