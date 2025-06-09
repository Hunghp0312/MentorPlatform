using System.Security.Claims;
using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Responses.Dashboards.Learners;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LearnerDashboardController : BaseController
    {
        private readonly ILearnerDashboardService _learnerDashboardService;

        public LearnerDashboardController(ILearnerDashboardService learnerDashboardService)
        {
            _learnerDashboardService = learnerDashboardService;
        }

        [HttpGet("upcoming-sessions")]
        [Authorize(Roles = "Learner")]
        [ProducesResponseType(typeof(LearnerDashboardUpcomingSession), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUpcomingSessions()
        {
            var learnerId = Guid.Parse(User.FindFirstValue("id")!);
            var result = await _learnerDashboardService.GetUpComingSessions(learnerId);
            return ToActionResult(result);
        }

        [HttpGet("learning-progress")]
        [Authorize(Roles = "Learner")]
        [ProducesResponseType(typeof(LearnerDashboardCompletion), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLearningProgress()
        {
            var learnerId = Guid.Parse(User.FindFirstValue("id")!);
            var result = await _learnerDashboardService.GetLearningProgress(learnerId);
            return ToActionResult(result);
        }

        [HttpGet("mentors")]
        [Authorize(Roles = "Learner")]
        [ProducesResponseType(typeof(LearnerDashboardMentor), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMentors()
        {
            var learnerId = Guid.Parse(User.FindFirstValue("id")!);
            var result = await _learnerDashboardService.GetMentors(learnerId);
            return ToActionResult(result);
        }

        [HttpGet("enrolled-courses")]
        [Authorize(Roles = "Learner")]
        [ProducesResponseType(typeof(LearnerDashboardCourseList), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEnrolledCourses()
        {
            var learnerId = Guid.Parse(User.FindFirstValue("id")!);
            var result = await _learnerDashboardService.GetEnrolledCourse(learnerId);
            return ToActionResult(result);
        }
    }
}
