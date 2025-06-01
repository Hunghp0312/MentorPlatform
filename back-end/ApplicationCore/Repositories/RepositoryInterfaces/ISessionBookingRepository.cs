using Infrastructure.BaseRepository;
using Infrastructure.Entities;
using System.Linq.Expressions;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ISessionBookingRepository : IBaseRepository<SessionBooking>
    {
        Task<bool> AnyAsync(Expression<Func<SessionBooking, bool>> predicate);
    }
}
