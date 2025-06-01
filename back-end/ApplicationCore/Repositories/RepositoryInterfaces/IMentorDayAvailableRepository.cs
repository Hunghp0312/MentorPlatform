using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IMentorDayAvailableRepository : IBaseRepository<MentorDayAvailable>
    {
        Task<MentorDayAvailable?> GetTimeSlotOfDayAsync(Guid mentorId, DateOnly date);
    }
}
