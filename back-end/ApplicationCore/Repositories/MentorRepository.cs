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

        public override async Task<MentorApplication?> GetByIdAsync(Guid id)
        {
            var query = await _dbSet.Include(a => a.Applicant)
                .ThenInclude(uae => uae.UserArenaOfExpertises).ThenInclude(uae => uae.AreaOfExpertise)
                .Include(a => a.Applicant)
                    .ThenInclude(uae => uae.UserProfile)
                .Include(x => x.AdminReviewer)
                .Include(x => x.SupportingDocuments)
                .Include(x => x.ApplicationStatus)
                .Include(m => m.MentorCertifications)
                .Include(m => m.MentorWorkExperiences)
                .Include(m => m.MentorEducations)
                .FirstOrDefaultAsync(m => m.ApplicantId.Equals(id));
            return query;

        }

        public async Task<MentorApplication?> GetDetailByIdAsync(Guid id)
        {
            var query = await _dbSet.Include(m => m.ApplicationStatus)
                .Include(m => m.Applicant)
                    .ThenInclude(u => u.UserProfile)
                .Include(m => m.SupportingDocuments)
                    .ThenInclude(s => s.DocumentContent)
                .Include(m => m.MentorCertifications)
                .Include(m => m.MentorWorkExperiences)
                .Include(m => m.MentorEducations)
                .SingleOrDefaultAsync(m => m.ApplicantId.Equals(id));
            return query;
        }

        public override async Task<(ICollection<MentorApplication>, int)> GetPagedAsync(
            Func<IQueryable<MentorApplication>, IQueryable<MentorApplication>>? filter,
            int pageIndex,
            int pageSize
        )
        {
            var queryable = _dbSet
                .Include(a => a.Applicant)
                .ThenInclude(uae => uae.UserArenaOfExpertises).ThenInclude(uae => uae.AreaOfExpertise)
                .Include(a => a.Applicant)
                .ThenInclude(uae => uae.UserProfile)
                .Include(x => x.AdminReviewer)
                .Include(x => x.SupportingDocuments)
                .Include(x => x.ApplicationStatus)
                .Include(m => m.MentorCertifications)
                .Include(m => m.MentorWorkExperiences)
                .Include(m => m.MentorEducations)
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