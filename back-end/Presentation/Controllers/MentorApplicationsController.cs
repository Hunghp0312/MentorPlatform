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
        [Authorize(Roles = "Mentor")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(MentorApplicationResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SubmitCompleteApplication([FromForm] SubmitMentorApplicationApiRequest apiRequest)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _mentorService.SubmitApplicationAsync(apiRequest, userId);

            return ToActionResult(result);
        }

        [HttpPut]
        [Authorize(Roles = "Mentor")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(MentorApplicationResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateMyApplication([FromForm] UpdateMyApplicationApiRequest apiRequest)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _mentorService.UpdateMyApplicationAsync(apiRequest, userId);

            return ToActionResult(result);
        }
    }
}
