using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IUserService
    {
        Task<OperationResult<PagedResult<UserResponseDto>>> GetUsersAsync(UserQueryParameters queryParameters); // Changed
        Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync();
        Task<OperationResult<UserResponseDto>> UpdateUserRoleAsync(Guid userId, UpdateUserRoleRequestDto request);
    }
}
