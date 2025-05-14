using ApplicationCore.DTOs;
using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Course;
using ApplicationCore.Interfaces;
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
            _courseService = courseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseRequestDto request)
        {
            var userId = Guid.Parse(User.FindFirst("sub")?.Value);
            var result = await _courseService.CreateCourseAsync(request);
            return ToActionResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(Guid id)
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return ToActionResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] CreateCourseRequestDto request)
        {
            var userId = Guid.Parse(User.FindFirst("sub")?.Value);
            var result = await _courseService.UpdateCourseAsync(id, request);
            return ToActionResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst("sub")?.Value);
            var result = await _courseService.DeleteCourseAsync(id);
            return ToActionResult(result);
        }

        [HttpPost("{id:guid}")]
        public async Task<IActionResult> GetCourseDetails(Guid id)
        {
            var result = await _courseService.GetCourseDetailsAsync(id);
            return ToActionResult(result);
        }
    }
}

