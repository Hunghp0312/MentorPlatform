using ApplicationCore.Common;
using ApplicationCore.Entity;
using ApplicationCore.Interfaces;
using ApplicationCore.Interfaces.RepositoryInterfaces;

namespace ApplicationCore.Services
{
    public class CourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICourseRepo _courseRepo;

        public CourseService(IUnitOfWork unitOfWork, ICourseRepo courseRepo)
        {
            _unitOfWork = unitOfWork;
            _courseRepo = courseRepo;
        }
    }
}
