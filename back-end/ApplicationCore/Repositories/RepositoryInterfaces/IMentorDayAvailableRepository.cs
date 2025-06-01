using Infrastructure.Entities;
using Infrastructure.BaseRepository;

namespace ApplicationCore.Repositories.RepositoryInterfaces;

public interface IMentorDayAvailableRepository : IBaseRepository<MentorDayAvailable>
{
    Task<MentorDayAvailable?> GetByMentorAndDateAsync(Guid mentorId, DateOnly day, bool includeSlots = false);
    Task<ICollection<MentorDayAvailable>> GetByMentorAndDateRangeAsync(Guid mentorId, DateOnly start, DateOnly end, bool includeSlots = false);
}