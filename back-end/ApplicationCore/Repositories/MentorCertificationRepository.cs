using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class MentorCertificationRepository : BaseRepository<MentorCertification>, IMentorCertificationRepository
    {
        public MentorCertificationRepository(AppDbContext context) : base(context)
        {
        }
    }
}
