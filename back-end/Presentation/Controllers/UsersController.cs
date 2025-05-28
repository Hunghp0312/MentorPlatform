using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;
using ApplicationCore.DTOs.QueryParameters;
using Microsoft.AspNetCore.Authorization;

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
            var result = await _userService.GetUserByIdsAsync(userId);
            return ToActionResult(result);
        }

        [HttpPut("{userProfileId}/profile")]
        [Authorize]
        [ProducesResponseType(typeof(UserProfileResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserProfile(Guid userProfileId,[FromForm] UpdateUserProfileRequestDto request)
        {
            var result = await _userService.UpdateUserProfile(userProfileId,request);
            return ToActionResult(result);
        }
    }
}
