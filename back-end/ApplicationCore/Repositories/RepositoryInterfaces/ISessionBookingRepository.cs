using System.Linq.Expressions;
using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ISessionBookingRepository : IBaseRepository<SessionBooking>
    {
        Task<bool> ExistsBookingForSlotAsync(
            Guid learnerId,
            Guid mentorId,
            Guid availabilitySlotId
        );
        Task<bool> AnyAsync(Expression<Func<SessionBooking, bool>> predicate);
        Task<SessionBooking?> GetBookingDetailsForDtoAsync(Guid id);
        Task<ICollection<SessionBooking>> GetUpcomingBookingWithLearnerId(
            Guid learnerId,
            DateTime dateTime
        );
    }
}
