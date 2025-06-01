using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : BaseController
    {
        private readonly ISessionBookingService _sessionBookingService;

        public SessionsController(ISessionBookingService sessionBookingService)
        {
            _sessionBookingService = sessionBookingService;
        }

        [HttpPost("booking")]
        [ProducesResponseType(typeof(CreatedBookingResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Learner")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto bookingRequest)
        {
            var learnerIdString = User.FindFirstValue("id")!;
            Guid learnerId = Guid.Parse(learnerIdString);
            var createdBookingResult = await _sessionBookingService.CreateNewBookingAsync(learnerId, bookingRequest);

            return ToActionResult(createdBookingResult);
        }

        // [HttpGet("paged")]
        // [ProducesResponseType(typeof(PagedResult<SessionBookingResponse>), StatusCodes.Status200OK)]
        // [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        // public async Task<IActionResult> GetPagedSessionBookings(
        //    [FromQuery] SessionBookingQueryParameters parameters
        //)
        // {
        //     var result = await _sessionBookingService.GetPagedSessionBookingsAsync(parameters);

        //     return ToActionResult(result);
        // }
    }
}
