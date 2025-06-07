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

    [HttpGet("{mentorId}/week")]
    [Authorize]
    [ProducesResponseType(typeof(MentorDaysAvailabilityResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetWeekAvailability(
        [FromRoute] Guid mentorId,
        [FromQuery] string weekStartDate
    )
    {
        var start = DateOnly.Parse(
            weekStartDate,
            System.Globalization.CultureInfo.InvariantCulture
        );
        var result = await _availabilityService.GetWeekAvailabilityAsync(mentorId, start);
        return ToActionResult(result);
    }

    [HttpGet("{mentorId}/day")]
    [Authorize]
    [ProducesResponseType(typeof(MentorDaysAvailabilityResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDayAvailability(Guid mentorId, string day)
    {
        var dayFormat = DateOnly.Parse(day, System.Globalization.CultureInfo.InvariantCulture);
        var result = await _availabilityService.GetDayAvailabilityAsync(mentorId, dayFormat);
        return ToActionResult(result);
    }

    [HttpPut("{mentorId}/days")]
    [Authorize(Roles = "Mentor")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SaveDaysAvailability(
        Guid mentorId,
        [FromBody] SaveDaysAvailabilityRequestDto request
    )
    {
        var isActiveClaim = User.Claims.FirstOrDefault(c => c.Type == "isActive");
        if (isActiveClaim == null || isActiveClaim.Value != "2")
        {
            return Forbid();
        }
        var result = await _availabilityService.SaveMentorDaysAvailability(mentorId, request);
        return ToActionResult(result);
    }
}
