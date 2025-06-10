using System.Security.Claims;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

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
    [Authorize]
    public async Task<IActionResult> GetCoursePagination(
        [FromQuery] CourseQueryParameters request
    )
    {
        var userIdString = User.FindFirstValue("id")!;
        var userId = Guid.Parse(userIdString);
        var res = await _courseService.GetPagedCourseAsync(request, userId);
        return ToActionResult(res);
    }

    [HttpPost]
    [ProducesResponseType(typeof(GetCourseDetailsResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    [Authorize(Roles = "Admin, Mentor")]
    public async Task<IActionResult> CreateCourse(
        [FromBody] CreateUpdateCourseRequest createDto
    )
    {
        var userIdString = User.FindFirstValue("id")!;
        var userId = Guid.Parse(userIdString);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _courseService.CreateCourseAsync(createDto, userId, role);
        return ToActionResult(result);
    }


    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(GetCourseDetailsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    [Authorize]
    public async Task<IActionResult> GetCourseById(Guid id)
    {
        var userIdString = User.FindFirstValue("id")!;
        var userId = Guid.Parse(userIdString);
        var result = await _courseService.GetCourseDetailsByIdAsync(id, userId);
        return ToActionResult(result);
    }


    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(GetCourseDetailsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    [Authorize(Roles = "Admin, Mentor")]
    public async Task<IActionResult> UpdateCourse(
        Guid id,
        [FromBody] CreateUpdateCourseRequest updateDto
    )
    {
        var result = await _courseService.UpdateCourseAsync(id, updateDto);
        return ToActionResult(result);
    }


    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    [Authorize(Roles = "Admin, Mentor")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var result = await _courseService.DeleteCourseAsync(id);
        return ToActionResult(result);
    }
    [HttpPost("enroll/{courseId}")]
    [Authorize(Roles = "Learner")]
    public async Task<IActionResult> EnrollCourse(Guid courseId)
    {
        var userIdString = User.FindFirstValue("id")!;
        var userId = Guid.Parse(userIdString);
        var result = await _courseService.EnrollCourse(courseId, userId);
        return ToActionResult(result);
    }
    [HttpPost("finish/{courseId}")]
    [Authorize(Roles = "Learner")]
    public async Task<IActionResult> FinishCourse(Guid courseId)
    {
        var userIdString = User.FindFirstValue("id")!;
        var userId = Guid.Parse(userIdString);
        var result = await _courseService.FinishCourse(courseId, userId);
        return ToActionResult(result);
    }
    [HttpPost("assign/{courseId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignCourse(Guid courseId, [FromBody] AssignCourseRequest assignCourseRequest)
    {

        var result = await _courseService.AssignCourse(courseId, assignCourseRequest.MentorId);
        return ToActionResult(result);
    }

    [HttpGet("mentor/course-dashboard")]
    [Authorize(Roles = "Mentor")]
    [ProducesResponseType(typeof(CourseDashboardDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<CourseDashboardDto>> GetMyCourseDashBoard()
    {
        var mentorIdString = User.FindFirstValue("id")!;
        Guid mentorId = Guid.Parse(mentorIdString);
        var pagedCourses = await _courseService.GetCourseDashBoardAsync(mentorId, new PaginationParameters());

        return ToActionResult(pagedCourses);
    }

    [HttpGet("mentor/course-asignment")]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<ICollection<GetCourseDetailsResponse>>> GetMyCourseAssignment()
    {
        var mentorIdString = User.FindFirstValue("id")!;
        Guid mentorId = Guid.Parse(mentorIdString);
        var result = await _courseService.GetCourseByMentorIdAsync(mentorId);
        return ToActionResult(result);
    }

    [HttpGet("learner")]
    public async Task<IActionResult> GetLearnerCourse([FromQuery] CourseQueryParameters courseQueryParameters)
    {
        var userIdString = User.FindFirstValue("id")!;
        var userId = Guid.Parse(userIdString);
        var result = await _courseService.GetCourseLearnerEnroll(userId, courseQueryParameters);
        return ToActionResult(result);
    }
}