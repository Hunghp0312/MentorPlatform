using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IMentorRepository : IBaseRepository<MentorApplication>
    {
        Task<MentorApplication?> GetDetailByIdAsync(Guid id);
        Task<MentorApplication?> GetMentorProfileByIdAsync(Guid id);
        Task<Dictionary<string, int>> GetApplicationStatusCountsAsync();
    }
}