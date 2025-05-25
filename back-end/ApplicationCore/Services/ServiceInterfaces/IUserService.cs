using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IUserService
    {
        Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync(string? role = null);
        Task<OperationResult<UserResponseDto>> UpdateUserRoleAsync(Guid userId, UpdateUserRoleRequestDto request);
    }
}
