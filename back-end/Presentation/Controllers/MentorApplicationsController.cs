using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MentorApplicationsController : BaseController
    {
        private readonly IMentorService _mentorService;

        public MentorApplicationsController(IMentorService mentorService)
        {
            _mentorService = mentorService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(MentorApplicationResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Mentor")]
        public async Task<IActionResult> SubmitCompleteApplication([FromForm] SubmitMentorApplicationApiRequest apiRequest)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _mentorService.SubmitApplicationAsync(apiRequest, userId);

            return ToActionResult(result);
        }
    }
}
