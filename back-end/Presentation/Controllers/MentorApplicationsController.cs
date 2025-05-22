using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MentorApplicationsController : BaseController
    {
        private readonly IMentorService _mentorService;

        public MentorApplicationsController(IMentorService mentorService)
        {
            _mentorService = mentorService;
        }

        [HttpPost("Submit")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SubmitCompleteApplication([FromForm] SubmitMentorApplicationApiRequest apiRequest)
        {
            return Ok();

            //var applicationCommand = new SubmitMentorApplicationCommand
            //{
            //    MotivationStatement = apiRequest.MotivationStatement,
            //    EducationDetails = apiRequest.EducationDetails,
            //    WorkExperienceDetails = apiRequest.WorkExperienceDetails,
            //    Certifications = apiRequest.Certifications
            //};

            //var filesToProcess = new List<UploadedFileDetail>();
            //if (apiRequest.SupportingDocument != null && apiRequest.SupportingDocument.Length > 0)
            //{
            //    var formFile = apiRequest.SupportingDocument;
            //    var memoryStream = new MemoryStream();
            //    await formFile.CopyToAsync(memoryStream);
            //    memoryStream.Position = 0;

            //    filesToProcess.Add(new UploadedFileDetail
            //    {
            //        FileName = formFile.FileName,
            //        ContentType = formFile.ContentType,
            //        Length = formFile.Length,
            //        ContentStream = memoryStream
            //    });
            //}

            //var result = await _mentorApplicationService.SubmitApplicationAsync(applicationCommand, filesToProcess);

            //return ToActionResult(result);
        }
    }
}
