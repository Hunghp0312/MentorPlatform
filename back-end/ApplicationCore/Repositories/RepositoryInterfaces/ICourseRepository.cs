using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ICourseRepository : IBaseRepository<Course>
    {
        Task<Course?> GetCourseWithCategoryAsync(Guid courseId);
        Task<(ICollection<Course>, int)> GetPagedCoursesAsync(
            Func<IQueryable<Course>, IQueryable<Course>> filter,
            int pageIndex,
            int pageSize
        );
        Task<bool> ExistsByNameAsync(string name, Guid excludeId);
        Task<bool> ExistsByNameAsync(string name);
        Task<ICollection<Course>?> GetCoursesByMentorId(Guid mentorId);
        Task<Course?> CheckIfMentorAssignToCourse(Guid courseId, Guid mentorId);
    }
}
