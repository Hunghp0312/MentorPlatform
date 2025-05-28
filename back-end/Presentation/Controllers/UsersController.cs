using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;
using ApplicationCore.DTOs.QueryParameters;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        [HttpGet("all")]
        [ProducesResponseType(typeof(IEnumerable<UserResponseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return ToActionResult(result);
        }

        [HttpGet("paged")]
        [ProducesResponseType(typeof(PagedResult<UserResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUsers([FromQuery] UserQueryParameters queryParameters)
        {
            var result = await _userService.GetUsersAsync(queryParameters);
            return ToActionResult(result);
        }

        [HttpPut("{userId}/status")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserStatus(Guid userId)
        {
            var result = await _userService.UpdateUserStatusAsync(userId);
            return ToActionResult(result);
        }

        [HttpGet("current-user")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _userService.GetUserByIdAsync(userId);
            return ToActionResult(result);
        }

        [HttpPut("{userProfileId}/profile")]
        [Authorize]
        [ProducesResponseType(typeof(UserProfileResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserProfile(Guid userProfileId, [FromForm] UpdateUserProfileRequestDto request)
        {
            var result = await _userService.UpdateUserProfile(userProfileId, request);
            return ToActionResult(result);
        }
    }
}
