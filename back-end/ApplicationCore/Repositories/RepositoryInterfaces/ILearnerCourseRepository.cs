using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface ILearnerCourseRepository : IBaseRepository<LearnerCourse>
    {
        Task<ICollection<LearnerCourse>> GetLearnerCoursesWithLearnerId(Guid learnerId);
    }
}
