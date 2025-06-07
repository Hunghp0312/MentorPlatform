using ApplicationCore.DTOs.Responses.Dashboard;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlatformStatisticsController : ControllerBase
    {
        private readonly IPlatformStatisticsService _platformStatisticsService;

        public PlatformStatisticsController(IPlatformStatisticsService platformStatisticsService)
        {
            _platformStatisticsService = platformStatisticsService;
        }

        [HttpGet("summary")]
        [ProducesResponseType(typeof(PlatformStatisticsResponseDto), 200)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSummary()
        {
            var result = await _platformStatisticsService.GetPlatformStatisticsAsync();
            return Ok(result);
        }
    }
}