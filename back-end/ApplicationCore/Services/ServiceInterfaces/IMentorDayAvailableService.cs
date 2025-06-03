using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.Mentors;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IMentorDayAvailableService
    {
        Task<OperationResult<MentorDayDto>> GetMentorTimeSlotsForDayAsync(Guid mentorId, DateOnly date);
    }
}
