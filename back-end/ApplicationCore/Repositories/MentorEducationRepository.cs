using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class MentorEducationRepository : BaseRepository<MentorEducation>, IMentorEducationRepository
    {
        public MentorEducationRepository(AppDbContext context) : base(context)
        {
        }
    }
}
