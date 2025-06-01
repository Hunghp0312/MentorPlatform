using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AvailabilityController : BaseController
{
    private readonly IAvailabilityService _availabilityService;

    public AvailabilityController(IAvailabilityService availabilityService)
    {
        _availabilityService = availabilityService;
    }

    /// <summary>
    /// Get weekly availability for mentor.
    /// </summary>
    /// <param name="mentorId">Mentor Id</param>
    /// <param name="weekStartDate">Start date of week (Sunday) ISO format yyyy-MM-dd</param>
    /// <returns></returns>
    [HttpGet("week")]
    [ProducesResponseType(typeof(WeekAvailabilityResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetWeekAvailability(Guid mentorId, string weekStartDate)
    {
        var start = DateOnly.Parse(weekStartDate);
        var result = await _availabilityService.GetWeekAvailabilityAsync(mentorId, start);
        return ToActionResult(result);
    }

    /// <summary>
    /// Save weekly availability
    /// </summary>
    [HttpPut("week")]
    [ProducesResponseType(typeof(WeekAvailabilityResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> SaveWeekAvailability([FromBody] SaveWeekAvailabilityRequestDto request)
    {
        var result = await _availabilityService.SaveWeekAvailabilityAsync(request);
        return ToActionResult(result);
    }
}