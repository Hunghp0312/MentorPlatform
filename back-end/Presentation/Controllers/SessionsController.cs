using ApplicationCore.DTOs.Requests.SessionBookings;
using ApplicationCore.Services.ServiceInterfaces;
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
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto bookingRequest)
        {
            var learnerIdString = User.FindFirstValue("id")!;
            Guid learnerId = Guid.Parse(learnerIdString);
            var createdBookingResult = await _sessionBookingService.CreateNewBookingAsync(learnerId, bookingRequest);

            return ToActionResult(createdBookingResult);
        }
    }
}
