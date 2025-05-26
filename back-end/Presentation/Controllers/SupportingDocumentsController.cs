using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportingDocumentsController : BaseController
    {
        private readonly ISupportingDocumentService _supportingDocumentService;

        public SupportingDocumentsController(ISupportingDocumentService supportingDocumentService)
        {
            _supportingDocumentService = supportingDocumentService;
        }

        [HttpPost]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(SupportingDocumentResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile([FromForm] SupportingDocumentRequest supportingDocumentRequest)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _supportingDocumentService.UploadFileAsync(supportingDocumentRequest.file, userId);

            return ToActionResult(result);
        }
    }
}
