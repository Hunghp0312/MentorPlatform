
using System.Security.Claims;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Resources;
using ApplicationCore.DTOs.Responses.DocumentContents;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceController : BaseController
    {
        private readonly IResourceService _resourceService;
        public ResourceController(IResourceService resourceService)
        {
            _resourceService = resourceService;
        }

        [HttpPost]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(ResourceResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddResource([FromBody] AddResourceRequest addResourceRequest)
        {
            var mentorIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(mentorIdString);
            var result = await _resourceService.AddResource(mentorId, addResourceRequest);
            return ToActionResult(result);
        }

        [HttpDelete("{resourceId:guid}")]
        [Authorize(Roles = "Admin, Mentor")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteResource(Guid resourceId)
        {
            var mentorIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(mentorIdString);
            var result = await _resourceService.DeleteResource(resourceId, mentorId);
            return ToActionResult(result);
        }

        [HttpPut("{resouceId:guid}")]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(ResourceResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditResource(Guid resouceId, [FromBody] EditResourceRequest editResourceRequest)
        {
            var mentorIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(mentorIdString);
            var result = await _resourceService.EditResource(resouceId, mentorId, editResourceRequest);
            return ToActionResult(result);
        }

        [HttpGet("resources")]
        [Authorize]
        [ProducesResponseType(typeof(PagedResult<ResourceResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllResources([FromQuery] ResourceQueryParameters resourceQueryParameters)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _resourceService.GetAllResources(resourceQueryParameters, userId);

            return ToActionResult(result);
        }

        [HttpPut("{resourceId:guid}/UrlUpload")]
        [Authorize]
        [ProducesResponseType(typeof(UpdateResourceUrlResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadUrlResource(Guid resourceId, string Url)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _resourceService.UpdateResourceUrl(resourceId, userId, Url);

            return ToActionResult(result);
        }

        [HttpPost("up-file/{resourceId:guid}")]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(ResourceFileResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadResourceFile([FromForm] ResourceFileRequest resourceFileRequest, Guid resourceId)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid mentorId = Guid.Parse(userIdString);
            var result = await _resourceService.UploadResourceFileAsync(resourceFileRequest.file, resourceId, mentorId);

            return ToActionResult(result);
        }

        [HttpGet("file/{fileId:guid}/details")]
        [Authorize]
        [ProducesResponseType(typeof(PagedResult<DocumentDetailResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFileResourceDetails(Guid fileId)
        {
            var userIdString = User.FindFirstValue("id")!;
            Guid userId = Guid.Parse(userIdString);
            var result = await _resourceService.GetFileResourceDetails(fileId, userId);
            return ToActionResult(result);
        }
    }
}