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

            existingResource.Url = url;
            existingResource.TypeOfResourceId = 3;
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
            var existingResource = await _resourceRepository.GetByIdAsync(resourceId);
            if (existingResource == null)
            {
                return OperationResult<ResourceFileResponse>.BadRequest("There is no resource with that Id found for this user");
            }

            if (mentorId != existingResource?.Course!.MentorId)
            {
                return OperationResult<ResourceFileResponse>.NotFound("You are not authorized to upload file to this resource, cause you are not the mentor of this course.");
            }

            if (existingResource.Url != null)
            {
                return OperationResult<ResourceFileResponse>.BadRequest("existing external file resource with that Id found for this user");
            }

            if (file == null)
            {
                return OperationResult<ResourceFileResponse>.NoContent();
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
                    return OperationResult<ResourceFileResponse>.BadRequest("Could not determine the resource type for the uploaded file.");
            }

            UploadedFileDetail processedFileDetail = null!;
            if (file.Length > 0)
            {
                var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                processedFileDetail = new UploadedFileDetail
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Length = file.Length,
                    ContentStream = memoryStream
                };
            }

            byte[] fileBytes;
            using (var memoryStreamToRead = new MemoryStream())
            {
                await processedFileDetail.ContentStream.CopyToAsync(memoryStreamToRead);
                fileBytes = memoryStreamToRead.ToArray();
            }
            await processedFileDetail.ContentStream.DisposeAsync();

            var documentContentEntity = new DocumentContent
            {
                Id = Guid.NewGuid(),
                FileContent = fileBytes,
                FileName = processedFileDetail.FileName,
                FileType = processedFileDetail.ContentType
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
            var user = await _userRepository.GetByIdAsync(userId);
            if (document == null)
            {
                return OperationResult<DocumentDetailResponse>.BadRequest("Document not found or has no content.");
            }
            if (user?.Role.Name == "Admin")
            {
                return OperationResult<DocumentDetailResponse>.Ok(document.ToDocumentDetailResponse());
            }
            if (user?.Role.Name == "Mentor" && document.Resource?.Course?.MentorId != userId)
            {
                return OperationResult<DocumentDetailResponse>.Unauthorized("You are not authorized to view this document, as you are not the mentor of this course.");
            }

            if (user?.Role.Name == "Learner" && document.Resource?.Course?.LearnerCourses.FirstOrDefault(x => x.LearnerId == userId) == null)
            {
                return OperationResult<DocumentDetailResponse>.Unauthorized("You are not authorized to view this document, as you are not enrolled in this course.");
            }

            return OperationResult<DocumentDetailResponse>.Ok(document.ToDocumentDetailResponse());

        }

        public async Task<OperationResult<object>> DeleteResourceFileAsync(Guid mentorId, Guid fileId)
        {
            var document = await _documentContentRepository.GetByIdAsync(fileId);
            if (document == null)
            {
                return OperationResult<object>.NotFound("File not found.");
            }

            if (document.Resource?.Course?.MentorId != mentorId)
            {
                return OperationResult<object>.Unauthorized("You are not authorized to delete this file, as you are not the mentor of this course.");
            }

            await _documentContentRepository.DeleteById(fileId);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<object>.NoContent();
        }

        public async Task<OperationResult<ResourceResponeGetAllService>> DeleteLinkFileAsync(Guid mentorId, Guid resourceId)
        {
            var resource = await _resourceRepository.GetByIdAsync(resourceId);
            if (resource == null)
            {
                return OperationResult<ResourceResponeGetAllService>.NotFound("Resource not found.");
            }

            if (resource.Course?.MentorId != mentorId)
            {
                return OperationResult<ResourceResponeGetAllService>.Unauthorized("You are not authorized to delete the link for this resource, as you are not the mentor of this course.");
            }

            resource.Url = "";
            _resourceRepository.Update(resource);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<ResourceResponeGetAllService>.Ok(resource.ToResourceResponeGetAllService());
        }
        public async Task<OperationResult<ResourceLinkResponse>> OpenResourceLinkAsync(Guid resourceId)
        {
            var resource = await _resourceRepository.GetByIdAsync(resourceId);
            if (resource == null)
            {
                return OperationResult<ResourceLinkResponse>.NotFound("Resource not found.");
            }

            if (string.IsNullOrEmpty(resource.Url))
            {
                return OperationResult<ResourceLinkResponse>.BadRequest("Resource does not have a valid link.");
            }

            return OperationResult<ResourceLinkResponse>.Ok(resource.ToResourceLinkResponse());
        }
    }
}