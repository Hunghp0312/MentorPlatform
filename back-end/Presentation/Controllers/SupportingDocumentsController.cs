using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Resources;
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
        private readonly IDocumentContentService _documentContentService;

        public SupportingDocumentsController(ISupportingDocumentService supportingDocumentService, IDocumentContentService documentContentService)
        {
            _supportingDocumentService = supportingDocumentService;
            _documentContentService = documentContentService;
        }

        [HttpPost]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(SupportingDocumentResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile(
            [FromForm] SupportingDocumentRequest supportingDocumentRequest
        )
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _supportingDocumentService.UploadFileAsync(
                supportingDocumentRequest.file,
                userId
            );

            return ToActionResult(result);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteFile(Guid id)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _supportingDocumentService.DeleteFileAsync(userId, id);

            return ToActionResult(result);
        }

        [HttpDelete("resource/{id:guid}")]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteResourceFile(Guid id)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _supportingDocumentService.DeleteResourceFileAsync(userId, id);

            return ToActionResult(result);
        }

        [HttpPost("resource/{id:guid}")]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(SupportingDocumentResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadResourceFile([FromForm] ResourceFileRequest resourceFileRequest, Guid resourceId)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(userIdString);
            var result = await _supportingDocumentService.UploadResourceFileAsync(resourceFileRequest.file, resourceId, mentorId);

            return ToActionResult(result);
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(PagedResult<SupportingDocumentResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFileDetails([FromQuery] Guid supportingDocumentId)
        {
            var result = await _supportingDocumentService.GetFileDetails(supportingDocumentId);
            return ToActionResult(result);
        }

        [HttpGet("{fileId:guid}/download")]
        [Authorize]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadFileForResource(Guid fileId)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);

            var result = await _documentContentService.DownloadResourceFileAsync(fileId, userId);
            var fileDownloadDto = result.Data;

            return File(fileDownloadDto!.Content, fileDownloadDto.ContentType, fileDownloadDto.FileName);
        }
    }
}
