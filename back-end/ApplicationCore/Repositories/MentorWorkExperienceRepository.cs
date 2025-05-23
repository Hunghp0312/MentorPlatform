using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class MentorWorkExperienceRepository : BaseRepository<MentorWorkExperience>, IMentorWorkExperienceRepository
    {
        public MentorWorkExperienceRepository(AppDbContext context) : base(context)
        {
        }
    }
}
