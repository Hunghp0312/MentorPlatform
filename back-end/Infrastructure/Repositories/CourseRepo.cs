using ApplicationCore.Entity;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CourseRepo : BaseRepo<Course>, ICourseRepo
    {
        public CourseRepo(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _dbSet.AnyAsync(c => c.Title.ToLower() == name.ToLower());
        }

        public async Task<bool> ExistsByNameAsync(string name, Guid excludeId)
        {
            return await _dbSet.AnyAsync(c => c.Id != excludeId && c.Title.ToLower() == name.ToLower());
        }
    }
}

