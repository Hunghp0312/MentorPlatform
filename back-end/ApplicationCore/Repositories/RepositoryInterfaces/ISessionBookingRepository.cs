using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ISessionBookingRepository : IBaseRepository<SessionBooking>
    {
        Task<bool> ExistsBookingForSlotAsync(Guid learnerId, Guid mentorId, Guid availabilitySlotId);
    }
}
