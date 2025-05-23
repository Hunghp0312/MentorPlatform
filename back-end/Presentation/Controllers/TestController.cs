using ApplicationCore.DTOs.Common;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IMentorService _mentorService;

        public TestController(IMentorService mentorService)
        {
            _mentorService = mentorService;
        }

        [HttpGet("test")]
        public async Task<IActionResult> Test([FromQuery] PaginationParameters paginationParameters, string applicationStatus)
        {
            var result = await _mentorService.GetAllMentorApplications(paginationParameters, applicationStatus);
            return Ok(result);
        }
    }
}