using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class MentorRepository : BaseRepository<MentorApplication>, IMentorRepository
    {
        public MentorRepository(AppDbContext context) : base(context)
        {
        }

        protected async Task<(ICollection<MentorApplication> mentors, int totalCount)> GetPaged(
            Func<IQueryable<MentorApplication>, IQueryable<MentorApplication>>? filter,
            int pageIndex,
            int pageSize
        )
        {
            var queryable = _dbSet.Include(x => x.ApplicantUser)
            .ThenInclude(x => x.UserProfile)
            .ThenInclude(x => x.UserArenaOfExpertises)
            .Include(x => x.SupportingDocuments)
            .Include(x => x.ApplicationStatus)
            .AsQueryable();
            if (filter != null)
            {
                queryable = filter(queryable);
            }
            var totalRecords = await queryable.CountAsync();
            var items = await queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, totalRecords);
        }
    }

}