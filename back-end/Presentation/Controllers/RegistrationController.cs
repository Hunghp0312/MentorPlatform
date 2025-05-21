
using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.Services.ServiceInterfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : BaseController
    {
        private readonly ILogger<RegistrationController> _logger;
        private readonly IRegistrationService _registrationService;
        private readonly IValidator<RegistrationRequest> _validator;

        public RegistrationController(
            ILogger<RegistrationController> logger,
            IRegistrationService registrationService,
            IValidator<RegistrationRequest> validator)
        {
            _logger = logger;
            _registrationService = registrationService;
            _validator = validator;
        }

        [HttpPost("step1")]
        public async Task<IActionResult> Step1([FromBody] RegistrationRequest request)
        {
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