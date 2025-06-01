using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
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
    [HttpGet("week")]
    [ProducesResponseType(typeof(WeekAvailabilityResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetWeekAvailability(Guid mentorId, string weekStartDate)
    {
        var start = DateOnly.Parse(weekStartDate);
        var result = await _availabilityService.GetWeekAvailabilityAsync(mentorId, start);
        return ToActionResult(result);
    }

    [HttpPut("week")]
    [ProducesResponseType(typeof(WeekAvailabilityResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SaveWeekAvailability([FromBody] SaveWeekAvailabilityRequestDto request)
    {
        var result = await _availabilityService.SaveWeekAvailabilityAsync(request);
        return ToActionResult(result);
    }

    [HttpPut("schedule-configuration/{mentorId}")]
    [ProducesResponseType(typeof(ScheduleConfigurationResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateScheduleConfiguration(Guid mentorId, [FromBody] UpdateScheduleConfigurationRequestDto requestDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _availabilityService.UpdateScheduleConfigurationAsync(mentorId, requestDto);
        return ToActionResult(result);
    }
}