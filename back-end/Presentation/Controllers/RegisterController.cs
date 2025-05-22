using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using ApplicationCore.Services.ServiceInterfaces;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Extensions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;


namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : BaseController
    {
        private readonly IRegistrationService _registrationService;
        private readonly IValidator<RegistrationRequest> _validator;

        public RegisterController(
            IRegistrationService registrationService,
            IValidator<RegistrationRequest> validator)
        {
            _registrationService = registrationService;
            _validator = validator;
        }


        [HttpPost("register")]
        [ProducesResponseType(typeof(RegistrationResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromForm] RegistrationRequest request, IFormFile? photoData)
        {
            if (photoData != null)
            {
                using var ms = new MemoryStream();
                await photoData.CopyToAsync(ms);
                request.PhotoData = ms.ToArray();
            }

            var validationResult = await _validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
            }

            var result = await _registrationService.RegisterAsync(request);
            return ToActionResult(result);
        }
    }
}