using ApplicationCore.Common;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class MentorDayAvailableService : IMentorDayAvailableService
    {
        private readonly IMentorDayAvailableRepository _mentorDayAvailableRepository;
        public MentorDayAvailableService(IMentorDayAvailableRepository mentorDayAvailableRepository)
        {
            _mentorDayAvailableRepository = mentorDayAvailableRepository;
        }
        public async Task<OperationResult<MentorDayDto>> GetMentorTimeSlotsForDayAsync(Guid mentorId, DateOnly date)
        {
            var mentorDayWithSlots = await _mentorDayAvailableRepository.GetTimeSlotOfDayAsync(mentorId, date);
            if (mentorDayWithSlots == null)
            {
                return OperationResult<MentorDayDto>.Ok(new MentorDayDto());
            }
            var mentorDayDto = mentorDayWithSlots!.ToMentorDayDto();

            return OperationResult<MentorDayDto>.Ok(mentorDayDto);
        }
    }
}
