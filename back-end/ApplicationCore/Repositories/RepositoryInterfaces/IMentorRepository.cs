using Infrastructure.BaseRepository;
using Infrastructure.Entities;

namespace ApplicationCore.Repositories.RepositoryInterfaces
{
    public interface IMentorRepository : IBaseRepository<MentorApplication>
    {
        // Task<MentorApplication> GetMentorApplicationById(Guid Id);
    }
}