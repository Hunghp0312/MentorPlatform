using ApplicationCore.DTOs;
using ApplicationCore.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : BaseController
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService =
                courseService ?? throw new ArgumentNullException(nameof(courseService));
        }

        [HttpPost("{id:guid}")]
        public async Task<IActionResult> GetCourseDetails(Guid id)
        {
            var res = await _courseService.GetCourseDetailsAsync(id);
            return ToActionResult<CourseDetailsResponse>(res);
        }
    }
}
