using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class ResourceRepository : BaseRepository<Resource>, IResourceRepository
    {
        public ResourceRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<Resource?> GetByDocumentContentIdAsync(Guid documentContentId)
        {
            return await _dbSet
                .Include(r => r.Course)
                .Include(r => r.ResourceCategory)
                .Include(r => r.TypeOfResource)
                .FirstOrDefaultAsync(r => r.DocumentContentId == documentContentId && !r.IsDeleted);
        }

        public override async Task<Resource?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(r => r.Course)
                .Include(r => r.ResourceCategory)
                .Include(r => r.TypeOfResource)
                .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
        }
        public override async Task<(ICollection<Resource>, int)> GetPagedAsync(
     Func<IQueryable<Resource>, IQueryable<Resource>>? filter,
     int pageIndex,
     int pageSize)
        {
            var queryable = _dbSet
                .Include(r => r.Course)
                .Include(r => r.ResourceCategory)
                .Include(r => r.TypeOfResource)
                .Include(r => r.DocumentContent)
                .Where(r => !r.IsDeleted)
                .Select(r => new Resource
                {
                    // Map Resource properties
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    Url = r.Url,
                    // Map other Resource properties as needed
                    Course = r.Course,
                    ResourceCategory = r.ResourceCategory,
                    TypeOfResource = r.TypeOfResource,
                    DocumentContentId = r.DocumentContentId,
                    DocumentContent = r.DocumentContent != null ? new DocumentContent
                    {
                        //Id = r.DocumentContent.Id,
                        FileName = r.DocumentContent.FileName,
                        FileType = r.DocumentContent.FileType
                        // Explicitly exclude FileContent
                    } : null
                })
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