using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class CourseRepository : BaseRepository<Course>, ICourseRepository
    {
        public CourseRepository(AppDbContext context)
            : base(context) { }

        public async Task<Course?> GetCourseWithCategoryAsync(Guid courseId)
        {
            return await _dbSet
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Level)
                .FirstOrDefaultAsync(c => c.Id == courseId);
        }

        public async Task<(ICollection<Course>, int)> GetPagedCoursesAsync(
            Func<IQueryable<Course>, IQueryable<Course>> filter,
            int pageIndex,
            int pageSize
        )
        {
            var query = _dbSet.AsQueryable();

            if (filter != null)
            {
                query = filter(query);
            }

            query = query.Include(c => c.Category).Include(c => c.Status).Include(c => c.Level);

            var totalRecords = await query.CountAsync();

            var pagedCourses = await query
                .OrderByDescending(c => c.Created)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (pagedCourses, totalRecords);
        }

        public async Task<ICollection<Course>?> GetCoursesByMentorId(Guid mentorId)
        {
            return await _dbSet
                .Include(c => c.Category)
                .Where(c => c.MentorId == mentorId)
                .ToListAsync();
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _dbSet.AnyAsync(c => c.Name == name);
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid excludeId)
        {
            return await _dbSet.AnyAsync(c => c.Name == name && c.Id != excludeId);
        }
        public async Task<Course?> GetCourseWithLearnerCourseAsync(Guid courseId)
        {
            return await _dbSet
                .Include(c => c.LearnerCourses)
                .ThenInclude(lc => lc.Learner)
                .FirstOrDefaultAsync(c => c.Id == courseId);

        }
    }
}
