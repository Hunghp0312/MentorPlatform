using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
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

        [HttpGet("mentor/my-bookings")]
        [Authorize(Roles = "Learner,Mentor")]
        public async Task<ActionResult<PagedResult<MentorBookingDetailsDto>>> GetMyMentorBookings(
       [FromQuery] MentorBookingsQueryParameters queryParameters)
        {
            var mentorIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(mentorIdString);
            var pagedBookings = await _sessionBookingService.GetBookingsForMentorAsync(mentorId, queryParameters);

            return ToActionResult(pagedBookings);
        }

        [HttpPut("{sessionId:guid}/status")]
        [Authorize(Roles = "Learner,Mentor")]
        public async Task<IActionResult> UpdateBookingStatus(Guid sessionId, [FromBody] UpdateBookingStatusRequestDto updateRequest)
        {

            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);

            var result = await _sessionBookingService.UpdateBookingStatusAsync(sessionId, userId, updateRequest);

            return ToActionResult(result);
        }

        [HttpPut("{sessionId:guid}/reschedule")]
        [Authorize(Roles = "Mentor")]
        public async Task<IActionResult> RescheduleBooking(Guid sessionId, [FromBody] RescheduleBookingRequestDto rescheduleRequest)
        {
            var mentorIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(mentorIdString);

            var result = await _sessionBookingService.RescheduleBookingByMentorAsync(sessionId, mentorId, rescheduleRequest);

            return ToActionResult(result);
        }
    }
}
