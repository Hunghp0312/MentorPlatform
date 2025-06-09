using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Resources;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using ApplicationCore.DTOs.Responses.DocumentContents;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.DTOs.Responses.SupportingDocuments;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;

namespace ApplicationCore.Services
{
    public class ResourceService : IResourceService
    {
        private readonly IResourceRepository _resourceRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IDocumentContentRepository _documentContentRepository;
        private readonly IUnitOfWork _unitOfWork;
        public ResourceService(IResourceRepository resourceRepository, IUnitOfWork unitOfWork, ICourseRepository courseRepository, IUserRepository userRepository, IDocumentContentRepository documentContentRepository)
        {
            _resourceRepository = resourceRepository;
            _unitOfWork = unitOfWork;
            _courseRepository = courseRepository;
            _userRepository = userRepository;
            _documentContentRepository = documentContentRepository;
        }

        public async Task<OperationResult<ResourceResponse>> AddResource(Guid mentorId, AddResourceRequest request)
        {
            if (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Description))
            {
                return OperationResult<ResourceResponse>.BadRequest("Title and Description are required.");
            }

            var course = await _courseRepository.CheckIfMentorAssignToCourse(request.CourseId, mentorId);
            if (course == null)
            {
                return OperationResult<ResourceResponse>.BadRequest("Course not found or not assigned to this mentor.");
            }
            var resource = new Resource
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                CourseId = request.CourseId,
                ResourceCategoryId = request.ResourceCategoryId,
                TypeOfResourceId = request.TypeOfResourceId,
            };
            await _resourceRepository.AddAsync(resource);
            await _unitOfWork.SaveChangesAsync();
            var savedResource = await _resourceRepository.GetByIdAsync(resource.Id);
            if (savedResource == null)
            {
                return OperationResult<ResourceResponse>.BadRequest("Failed to retrieve the saved resource.");
            }
            return OperationResult<ResourceResponse>.Ok(savedResource.ToResourceResponse());
        }

        public async Task<OperationResult<ResourceResponse>> DeleteResource(Guid resourceId, Guid UserId)
        {
            var resource = await _resourceRepository.GetByIdAsync(resourceId);
            if (resource == null)
            {
                return OperationResult<ResourceResponse>.NotFound($"Resource with ID {resourceId} not found.");
            }

            var user = await _userRepository.GetByIdAsync(UserId);
            if (user == null)
            {
                return OperationResult<ResourceResponse>.NotFound($"User with ID {UserId} not found.");
            }

            if (UserId != resource.Course?.MentorId && user.Role?.Name != "Admin")
            {
                return OperationResult<ResourceResponse>.Unauthorized(
                    "You are not authorized to delete this resource because you are not the mentor of this course or an admin."
                );
            }

            _resourceRepository.Delete(resource);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<ResourceResponse>.NoContent();
        }



        public async Task<OperationResult<ResourceResponse>> EditResource(Guid resourceId, Guid mentorId, EditResourceRequest request)
        {
            var resource = await _resourceRepository.GetByIdAsync(resourceId);
            if (mentorId != resource?.Course!.MentorId)
            {
                return OperationResult<ResourceResponse>.NotFound("You are not authorized to edit this resource, cause you are not the mentor of this course.");
            }
            if (resource == null)
            {
                return OperationResult<ResourceResponse>.NotFound("Resource not found");
            }
            resource.TypeOfResourceId = request.TypeOfResourceId;
            resource.ResourceCategoryId = request.ResourceCategoryId;
            resource.Title = request.Title;
            resource.Description = request.Description;
            _resourceRepository.Update(resource);
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<ResourceResponse>.Ok(resource.ToResourceResponse());
        }

        public async Task<OperationResult<PagedResult<ResourceResponeGetAllService>>> GetAllResources(ResourceQueryParameters resourceQueryParameters, Guid UserId)
        {
            var user = await _userRepository.GetUserByIdAsync(UserId);
            if (user == null)
            {
                return OperationResult<PagedResult<ResourceResponeGetAllService>>.NotFound("User not found");
            }

            Func<IQueryable<Resource>, IQueryable<Resource>>? filter = q =>
            {
                if (user.Role?.Name != "Admin")
                {
                    q = q.Where(r => r.Course!.MentorId == UserId);
                }
                else if (user.Role?.Name == "Mentor")
                {
                    q = q.Where(r => r.Course!.MentorId == UserId);
                }
                else if (user.Role?.Name == "Learner")
                {
                    q = q.Where(r => r.Course!.LearnerCourses.Any(lc => lc.LearnerId == UserId));
                }
                if (!string.IsNullOrEmpty(resourceQueryParameters.Query))
                {
                    q = q.Where(r =>
                        r.Title != null && r.Title.Contains(resourceQueryParameters.Query)
                       );
                }

                if (resourceQueryParameters.ResourceCategoryId.HasValue)
                {
                    q = q.Where(r => r.ResourceCategoryId == resourceQueryParameters.ResourceCategoryId.Value);
                }

                return q;
            };

            var (resources, totalCount) = await _resourceRepository.GetPagedAsync(filter, resourceQueryParameters.PageIndex, resourceQueryParameters.PageSize);
            var pagedResult = new PagedResult<ResourceResponeGetAllService>
            {
                Items = resources.Select(r => r.ToResourceResponeGetAllService()).ToList(),
                PageIndex = resourceQueryParameters.PageIndex,
                PageSize = resourceQueryParameters.PageSize,
                TotalItems = totalCount
            };
            return OperationResult<PagedResult<ResourceResponeGetAllService>>.Ok(pagedResult);
        }

        public async Task<OperationResult<UpdateResourceUrlResponse>> UpdateResourceUrl(Guid resourceId, Guid userId, string url)
        {
            var existingResource = await _resourceRepository.GetByIdAsync(resourceId);
            if (existingResource == null)
            {
                return OperationResult<UpdateResourceUrlResponse>.BadRequest("There is no resource with that Id found for this user");
            }
            if (userId != existingResource?.Course!.MentorId)
            {
                return OperationResult<UpdateResourceUrlResponse>.NotFound("You are not authorized to upload file to this resource, cause you are not the mentor of this course.");
            }
            if (existingResource.DocumentContentId.HasValue && (existingResource.TypeOfResourceId == 1 || existingResource.TypeOfResourceId == 2))
            {
                await _documentContentRepository.DeleteById(existingResource.DocumentContentId.Value);

            }

            existingResource.Url = url;
            existingResource.TypeOfResourceId = 3;
            existingResource.DocumentContentId = null;
            _resourceRepository.Update(existingResource);
            await _unitOfWork.SaveChangesAsync();

            var response = new UpdateResourceUrlResponse()
            {
                ResourceId = existingResource.Id,
                Url = existingResource.Url
            };
            return OperationResult<UpdateResourceUrlResponse>.Ok(response);
        }

        public async Task<OperationResult<ResourceFileResponse>> UploadResourceFileAsync(IFormFile? file, Guid resourceId, Guid mentorId)
        {

            if (file == null || file.Length == 0)
            {
                return OperationResult<ResourceFileResponse>.BadRequest("No file provided or file is empty.");
            }
            if (file.Length > 5_000_000)
            {
                return OperationResult<ResourceFileResponse>.BadRequest("File size exceeds 5MB limit.");
            }


            var existingResource = await _resourceRepository.GetByIdAsync(resourceId);
            if (existingResource == null)
            {
                return OperationResult<ResourceFileResponse>.BadRequest("There is no resource with that Id found for this user");
            }
            if (mentorId != existingResource?.Course!.MentorId)
            {
                return OperationResult<ResourceFileResponse>.Unauthorized("You are not authorized to upload file to this resource, cause you are not the mentor of this course.");
            }


            int determinedTypeOfResourceId;
            switch (file.ContentType)
            {
                case "application/pdf":
                    determinedTypeOfResourceId = 2;
                    break;
                case "video/mp4":
                    determinedTypeOfResourceId = 1;
                    break;
                default:
                    return OperationResult<ResourceFileResponse>.BadRequest("Unsupported file type. Only PDF and MP4 are allowed.");
            }

            await _unitOfWork.BeginTransactionAsync();

            if (existingResource.DocumentContentId.HasValue && (existingResource.TypeOfResourceId == 1 || existingResource.TypeOfResourceId == 2))
            {
                await _documentContentRepository.DeleteById(existingResource.DocumentContentId.Value);
            }
            else if (existingResource.Url != null && existingResource.TypeOfResourceId == 3)
            {
                existingResource.Url = null;
            }


            byte[] fileBytes;
            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    fileBytes = memoryStream.ToArray();
                }

            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return OperationResult<ResourceFileResponse>.BadRequest($"Failed to process file: {ex.Message}");
            }


            var documentContentEntity = new DocumentContent
            {
                Id = Guid.NewGuid(),
                FileContent = fileBytes,
                FileName = file.FileName,
                FileType = file.ContentType
            };
            await _documentContentRepository.AddAsync(documentContentEntity);


            existingResource.DocumentContentId = documentContentEntity.Id;
            existingResource.TypeOfResourceId = determinedTypeOfResourceId;

            _resourceRepository.Update(existingResource);

            await _unitOfWork.SaveChangesAsync();

            var response = new ResourceFileResponse
            {
                FileId = documentContentEntity.Id,
                FileName = documentContentEntity.FileName,
                FileType = documentContentEntity.FileType,
            };

            return OperationResult<ResourceFileResponse>.Created(response);
        }



        public async Task<OperationResult<DocumentDetailResponse>> GetFileResourceDetails(Guid fileId, Guid userId)
        {
            var document = await _documentContentRepository.GetByIdAsync(fileId);
            if (document == null)
            {
                return OperationResult<DocumentDetailResponse>.BadRequest("Document not found or has no content.");
            }

            return OperationResult<DocumentDetailResponse>.Ok(document.ToDocumentDetailResponse());

        }

    }
}