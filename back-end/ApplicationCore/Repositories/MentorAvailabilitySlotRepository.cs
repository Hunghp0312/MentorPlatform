using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.BaseRepository;
using Infrastructure.Data.Context;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories
{
    public class MentorAvailabilitySlotRepository : BaseRepository<MentorAvailabilitySlot>, IMentorAvailabilitySlotRepository
    {
        public MentorAvailabilitySlotRepository(AppDbContext context) : base(context)
        {
        }
    }
}
