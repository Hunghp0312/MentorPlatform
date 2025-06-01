using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using System.Threading.Tasks;

namespace ApplicationCore.Repositories
{
    public class SessionBookingRepository : BaseRepository<SessionBooking>, ISessionBookingRepository
    {
        public SessionBookingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> AnyAsync(Expression<Func<SessionBooking, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }
    }
}
