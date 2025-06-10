using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using ApplicationCore.DTOs.Responses.FileSize;
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

        [HttpGet("resource/{resourceId:guid}/total-size")]
        [Authorize]
        [ProducesResponseType(typeof(SumOfFilesResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTotalFileDownloadSize(Guid resourceId)
        {
            var result = await _documentContentService.GetTotalFileDownloadSize(resourceId);
            return ToActionResult(result);
        }
    }
}
