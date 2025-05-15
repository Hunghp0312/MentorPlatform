using ApplicationCore.DTOs;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CourseRepo : BaseRepo<Course>, ICourseRepo
    {
        public CourseRepo(AppDbContext context)
            : base(context) { }

        public async Task<Course?> GetCourseWithCategoryAsync(Guid courseId)
        {
            return await _dbSet.Include(c => c.Category).FirstOrDefaultAsync(c => c.Id == courseId);
        }

        public async Task<(ICollection<Course>, int)> GetPagedCoursesAsync(
            Func<IQueryable<Course>, IQueryable<Course>> filter,
            int pageIndex,
            int pageSize
        )
        {
            // Start with the basic queryable (in-memory, database, etc.)
            var query = _dbSet.AsQueryable(); // Assuming _dbSet is your DbSet or equivalent

            // Apply the passed filter from service
            if (filter != null)
            {
                query = filter(query);
            }

            // Apply the Include logic for category (keeping this in the repo)
            query = query.Include(c => c.Category);

            // Get total count of records
            var totalRecords = await query.CountAsync();

            // Apply pagination
            var pagedCourses = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(); // Make sure you return a list of courses

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
            return await _dbSet.AnyAsync(c => c.Title == name);
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid excludeId)
        {
            return await _dbSet.AnyAsync(c => c.Title == name && c.Id != excludeId);
        }
    }
}
