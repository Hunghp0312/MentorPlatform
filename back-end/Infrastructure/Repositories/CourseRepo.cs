using ApplicationCore.Entity;
using ApplicationCore.Interfaces.RepositoryInterfaces;
using Infrastructure.Data.Context;

namespace Infrastructure.Repositories
{
    public class CourseRepo : BaseRepo<Course>, ICourseRepo
    {
        public CourseRepo(AppDbContext context)
            : base(context) { }
    }
}
