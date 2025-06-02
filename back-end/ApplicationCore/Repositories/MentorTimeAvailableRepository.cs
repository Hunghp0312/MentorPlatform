using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class MentorTimeAvailableRepository
        : BaseRepository<MentorTimeAvailable>,
            IMentorTimeAvailableRepository
    {
        public MentorTimeAvailableRepository(AppDbContext context)
            : base(context) { }
    }
}
