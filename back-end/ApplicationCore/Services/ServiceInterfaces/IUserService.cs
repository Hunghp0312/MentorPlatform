using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IUserService
    {
        Task<OperationResult<PagedResult<UserResponseDto>>> GetUsersAsync(UserQueryParameters queryParameters);
        Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync();
        Task<OperationResult<UserResponseDto>> UpdateUserStatusAsync(Guid userId, UpdateUserStatusRequestDto requestDto);
        Task<OperationResult<UserResponseDto>> GetUserByIdAsync(Guid userId);
        Task<OperationResult<UserProfileResponseDto>> UpdateUserProfile(Guid userProfileId,UpdateUserProfileRequestDto requestDto);

    }
}
