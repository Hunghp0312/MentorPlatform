using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models.Dtos.QueryParameter;

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

        [HttpGet]
        public async Task<IActionResult> GetCoursePagination([FromQuery] CoursePagedRequest request)
        {
            var res = await _courseService.GetPagedCourseAsync(request);
            return ToActionResult<PagedResult<CourseListResponse>>(res);
        }

        [HttpPost("{id:guid}")]
        public async Task<IActionResult> GetCourseDetails(Guid id)
        {
            var res = await _courseService.GetCourseDetailsAsync(id);
            return ToActionResult<CourseDetailsResponse>(res);
        }
    }
}
