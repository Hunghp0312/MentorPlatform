using ApplicationCore.DTOs.Requests.Availability;
using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces;

public interface IMentorDayAvailableRepository : IBaseRepository<MentorDayAvailable>
{
    Task<MentorDayAvailable?> GetByMentorAndDateAsync(Guid mentorId, DateOnly day);
    Task<ICollection<MentorDayAvailable>> GetByMentorAndDateRangeAsync(
        Guid mentorId,
        DateOnly start,
        DateOnly end
    );
    Task<MentorDayAvailable?> GetDayAvailabilityAsync(Guid mentorId, DateOnly day);

    Task DeleteDayAvailable(Guid mentorId, ICollection<DateOnly> days);
}
