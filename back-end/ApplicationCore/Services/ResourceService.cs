using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Resources;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services
{
    public class ResourceService : IResourceService
    {
        private readonly IResourceRepository _resourceRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        public ResourceService(IResourceRepository resourceRepository, IUnitOfWork unitOfWork, ICourseRepository courseRepository, IUserRepository userRepository)
        {
            _resourceRepository = resourceRepository;
            _unitOfWork = unitOfWork;
            _courseRepository = courseRepository;
            _userRepository = userRepository;
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

            return OperationResult<ResourceResponse>.Ok(resource.ToResourceResponse());
        }

        public async Task<OperationResult<ResourceResponse>> DeleteResource(Guid resourceId, Guid UserId)
        {
            var resource = await _resourceRepository.GetByIdAsync(resourceId);
            if (resource == null)
            {
                return OperationResult<ResourceResponse>.NotFound("Resource not found");
            }
            var user = await _userRepository.GetByIdAsync(UserId);
            if (UserId != resource.Course!.MentorId && (user == null || user.Role?.Name != "Admin"))
            {
                return OperationResult<ResourceResponse>.NotFound("You are not authorized to delete this resource, cause you are not the mentor of this course.");
            }

            _resourceRepository.Delete(resource);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<ResourceResponse>.NoContent();
        }

        public Task DownloadFile(Guid FileId)
        {
            throw new NotImplementedException();
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

        public async Task<OperationResult<PagedResult<ResourceResponse>>> GetAllResources(ResourceQueryParameters resourceQueryParameters, Guid UserId)
        {
            var user = await _userRepository.GetUserByIdAsync(UserId);
            if (user == null)
            {
                return OperationResult<PagedResult<ResourceResponse>>.NotFound("User not found");
            }

            Func<IQueryable<Resource>, IQueryable<Resource>>? filter = q =>
            {
                if (user.Role?.Name != "Admin")
                {
                    q = q.Where(r => r.Course!.MentorId == UserId);
                }

                if (!string.IsNullOrEmpty(resourceQueryParameters.Query))
                {
                    q = q.Where(r =>
                        (r.Title != null && r.Title.Contains(resourceQueryParameters.Query)) ||
                        (r.Description != null && r.Description.Contains(resourceQueryParameters.Query)));
                }

                if (resourceQueryParameters.TypeOfResourceId.HasValue)
                {
                    q = q.Where(r => r.ResourceCategoryId == resourceQueryParameters.TypeOfResourceId.Value);
                }

                if (resourceQueryParameters.TypeOfResourceId.HasValue)
                {
                    q = q.Where(r => r.TypeOfResourceId == resourceQueryParameters.TypeOfResourceId.Value);
                }

                return q;
            };

            var (resources, totalCount) = await _resourceRepository.GetPagedAsync(filter, resourceQueryParameters.PageIndex, resourceQueryParameters.PageSize);
            var pagedResult = new PagedResult<ResourceResponse>
            {
                Items = resources.Select(r => r.ToResourceResponse()).ToList(),
                PageIndex = resourceQueryParameters.PageIndex,
                PageSize = resourceQueryParameters.PageSize,
                TotalItems = totalCount
            };
            return OperationResult<PagedResult<ResourceResponse>>.Ok(pagedResult);
        }

    }
}