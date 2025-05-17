using ApplicationCore.DTOs;
using ApplicationCore.Entity;

namespace ApplicationCore.Interfaces.RepositoryInterfaces
{
    public interface ICourseRepo : IBaseRepo<Course>
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
    }
}
