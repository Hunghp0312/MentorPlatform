using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class SessionBookingRepository : BaseRepository<SessionBooking>, ISessionBookingRepository
    {
        public SessionBookingRepository(AppDbContext context) : base(context)
        {
        }
    }
}
