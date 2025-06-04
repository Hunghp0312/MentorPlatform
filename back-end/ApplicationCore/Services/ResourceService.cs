using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;

namespace ApplicationCore.Services
{
    public class ResourceService : IResourceService
    {
        private readonly IResourceRepository _resourceRepository;
        private readonly IUnitOfWork _unitOfWork;
        public ResourceService(IResourceRepository resourceRepository, IUnitOfWork unitOfWork)
        {
            _resourceRepository = resourceRepository;
            _unitOfWork = unitOfWork;
        }

    }
}