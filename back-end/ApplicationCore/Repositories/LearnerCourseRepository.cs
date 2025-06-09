using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Repositories
{
    public class LearnerCourseRepository : BaseRepository<LearnerCourse>, ILearnerCourseRepository
    {
        public LearnerCourseRepository(AppDbContext context)
            : base(context) { }

        public async Task<ICollection<LearnerCourse>> GetLearnerCoursesWithLearnerId(Guid learnerId)
        {
            var learnerCourses = await _dbSet
                .Include(lc => lc.Course)
                .ThenInclude(c => c!.Category)
                .Where(lc => lc.LearnerId == learnerId)
                .OrderByDescending(lc => lc.EnrolledAt)
                .ToListAsync();

            return learnerCourses;
        }
    }
}
