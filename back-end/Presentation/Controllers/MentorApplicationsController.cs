using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> SubmitCompleteApplication([FromForm] SubmitMentorApplicationApiRequest apiRequest)
        {
            var result = await _mentorService.SubmitApplicationAsync(apiRequest);

            return ToActionResult(result);
        }
        [HttpGet("applications")]
        [ProducesResponseType(typeof(PagedResult<MentorApplicantResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllMentorApplications([FromQuery] PaginationParameters paginationParameters, [FromQuery] int applicationStatus = 0, [FromQuery] string? searchString = null)
        {
            var result = await _mentorService.GetAllMentorApplications(paginationParameters, applicationStatus, searchString);

            return ToActionResult(result);
        }
        [HttpPut("update-status")]
        [ProducesResponseType(typeof(MentorApplicantResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateMentorApplicationStatus([FromBody] MentorUpdateStatusRequest request)
        {
            var result = await _mentorService.UpdateMentorApplicationStatus(request);

            return ToActionResult(result);
        }
    }
}
