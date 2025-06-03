using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IUserService
    {
        Task<OperationResult<PagedResult<UserResponseDto>>> GetUsersAsync(UserQueryParameters queryParameters);
        Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync();
        Task<OperationResult<UserResponseDto>> UpdateUserStatusAsync(Guid userId);
        Task<OperationResult<UserResponseDto>> GetUserByIdAsync(Guid userId);
        Task<OperationResult<UserProfileResponseDto>> UpdateUserProfile(Guid userProfileId, UpdateUserProfileRequestDto requestDto, Guid requestUserId, string role);
        Task<OperationResult<UserFullProfileResponse>> GetFullUserProfileByIdAsync(Guid userId, Guid requestUserId, string role);
        Task<OperationResult<IEnumerable<MentorFilterResponse>>> GetAllMentors(PaginationParameters queryParameters);
    }
}
