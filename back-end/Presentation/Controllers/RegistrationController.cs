using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using ApplicationCore.Services.ServiceInterfaces;
using Humanizer;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : BaseController
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpPost("create-profile")]
        [ProducesResponseType(typeof(UserProfileResponse), 200)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateProfile([FromForm] RegistrationProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _registrationService.CreateProfileAsync(request);

            return ToActionResult(result);
        }

        [HttpPost("{userId}/set-preferences")]
        [ProducesResponseType(typeof(UserPreferenceResponse), 200)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SetUserPreferences(Guid userId, [FromBody] SetPreferenceRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _registrationService.SetUserPreferencesAsync(userId, request);

            return ToActionResult(result);
        }

        [HttpGet("check-email")]
        [ProducesResponseType(typeof(CheckEmailResponse), 200)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckEmailExists([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new FailResponse { Message = "Email cannot be empty." });
            }
            var result = await _registrationService.CheckEmailExistsAsync(email);
            return ToActionResult(result);
        }
    }
}
