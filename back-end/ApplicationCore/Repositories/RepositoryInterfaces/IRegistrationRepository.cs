using Infrastructure.BaseRepository;
using Infrastructure.Entities;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IRegistrationRepository : IBaseRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task AddUserProfileAsync(UserProfile userProfile);
        Task<UserProfile?> GetUserProfileAsync(Guid userId);
        Task UpdateUserProfileAsync(UserProfile userProfile);
        Task<Role?> GetRoleByIdAsync(int id);
        Task<AreaOfExpertise?> GetAreaOfExpertiseByIdAsync(int id);
        Task<IEnumerable<AreaOfExpertise>> GetAreaOfExpertisesByIdsAsync(IEnumerable<int> id);
        Task<Availability?> GetAvailabilityByIdAsync(int availabilityId);
        Task<IEnumerable<Availability>> GetAvailabilitiesByIdsAsync(IEnumerable<int> availabilityIds);
        Task<IEnumerable<CommunicationMethod>> GetCommunicationMethodsByIdsAsync(IEnumerable<int> ids);
    }
}
