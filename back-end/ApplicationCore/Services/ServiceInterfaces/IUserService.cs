using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IUserService
    {
        Task<OperationResult<PagedResult<UserResponseDto>>> GetUsersAsync(UserQueryParameters queryParameters); // Changed
        Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync();
        Task<OperationResult<UserResponseDto>> UpdateUserRoleAsync(Guid userId, UpdateUserRoleRequestDto requestDto);
        Task<OperationResult<UserResponseDto>> GetUserByIdsAsync(Guid userId); // Added new method
        Task<OperationResult<UserProfileResponseDto>> UpdateUserProfile(UpdateUserProfileRequestDto requestDto);
    }
}
