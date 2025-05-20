using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : BaseController
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService =
                courseService ?? throw new ArgumentNullException(nameof(courseService));
        }

        [HttpGet]
        [ProducesResponseType(
            typeof(PagedResult<GetCourseDetailsResponse>),
            StatusCodes.Status200OK
        )]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCoursePagination(
            [FromQuery] CourseQueryParameters request
        )
        {
            var res = await _courseService.GetPagedCourseAsync(request);
            return ToActionResult(res);
        }

        [HttpPost]
        [ProducesResponseType(typeof(GetCourseDetailsResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCourse(
            [FromBody] CreateUpdateCourseRequest createDto
        )
        {
            var result = await _courseService.CreateCourseAsync(createDto);
            return ToActionResult(result);
        }

        // GET: api/Courses/{id}
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(GetCourseDetailsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCourseById(Guid id)
        {
            var result = await _courseService.GetCourseDetailsByIdAsync(id);
            return ToActionResult(result);
        }

        // PUT: api/Courses/{id}
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(GetCourseDetailsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCourse(
            Guid id,
            [FromBody] CreateUpdateCourseRequest updateDto
        )
        {
            var result = await _courseService.UpdateCourseAsync(id, updateDto);
            return ToActionResult(result);
        }

        // DELETE: api/Courses/{id}
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            return ToActionResult(result);
        }
    }
}
