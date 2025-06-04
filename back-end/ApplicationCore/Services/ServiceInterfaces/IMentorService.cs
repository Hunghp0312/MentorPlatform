using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IMentorService
    {
        Task<OperationResult<PagedResult<MentorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, int applicationStatus);
        Task<OperationResult<MentorApplicantResponse>> UpdateMentorApplicationStatus(MentorUpdateStatusRequest request, Guid adminUserId);
        Task<OperationResult<MentorApplicationResponseDto>> SubmitApplicationAsync(
           SubmitMentorApplicationApiRequest apiRequest, Guid applicantUserId
       );
        Task<OperationResult<MentorApplicationDetailResponse>> GetMyApplicationDetailAsync(Guid applicantUserId);

        Task<OperationResult<MentorApplicationResponseDto>> UpdateMyApplicationAsync(
          UpdateMyApplicationApiRequest apiRequest, Guid applicantUserId
      );
        Task<OperationResult<MentorApplicationDetailDto>> GettMentoApplicationDetailAsync(Guid mentorApplicationId);
        Task<OperationResult<PagedResult<MentorCardDto>>> GetAvailableMentorsAsync(AvailableMentorQueryParameters queryParameters);
        Task<OperationResult<MentorProfileDto>> GetMentorProfileDetailAsync(Guid mentorApplicationId);
    }
}