using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Mentors;
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
        private readonly IMentorDayAvailableService _mentorDayAvailableService;
        public SessionsController(ISessionBookingService sessionBookingService, IMentorDayAvailableService mentorDayAvailableService)
        {
            _sessionBookingService = sessionBookingService;
            _mentorDayAvailableService = mentorDayAvailableService;
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

        [HttpGet("{mentorId}/schedule-by-day")]
        public async Task<ActionResult<MentorDayDto>> GetMentorScheduleForDay(
        Guid mentorId,
        [FromQuery] DateOnly date)
        {
            var timeSlots = await _mentorDayAvailableService.GetMentorTimeSlotsForDayAsync(mentorId, date);

            return ToActionResult(timeSlots);
        }
    }
}
