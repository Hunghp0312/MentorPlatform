using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApplicationCore.Common;
using ApplicationCore.DTOs.QueryParameters;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<UserResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUsers([FromQuery] UserQueryParameters queryParameters)
        {
            var result = await _userService.GetUsersAsync(queryParameters);
            return ToActionResult(result);
        }

        /* Optional: Keep GetAllUsers if a non-paginated version is still needed for some reason, 
           otherwise it can be removed or refactored if GetUsersAsync covers all needs.
        [HttpGet("all")] // Example: different route if keeping both
        [ProducesResponseType(typeof(IEnumerable<UserResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllUsersLegacy([FromQuery] string? role)
        {
            var result = await _userService.GetAllUsersAsync(role);
            return ToActionResult(result);
        }
        */

        [HttpPut("{userId}/role")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] UpdateUserRoleRequestDto request)
        {
            var result = await _userService.UpdateUserRoleAsync(userId, request);
            return ToActionResult(result);
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            var result = await _userService.GetUserByIdAsync(userId);
            return ToActionResult(result);
        }
    }
}
