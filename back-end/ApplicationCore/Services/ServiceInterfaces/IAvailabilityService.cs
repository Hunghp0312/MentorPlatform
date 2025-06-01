using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;

namespace ApplicationCore.Services.ServiceInterfaces;

public interface IAvailabilityService
{
    Task<OperationResult<MentorDaysAvailabilityResponseDto>> GetWeekAvailabilityAsync(
        Guid mentorId,
        DateOnly weekStartDate
    );

    Task<OperationResult<MentorDaysAvailabilityResponseDto>> SaveMentorDaysAvailability(
        Guid mentorId,
        SaveDaysAvailabilityRequestDto requestDto
    );
    Task UpdateOrCreateMentorDayAvailableAsync(Guid mentorId, MentorAvailabilityRequestDto dayDto);

    Task<OperationResult<DayAvailabilityDto>> GetDayAvailabilityAsync(Guid mentorId, DateOnly day);

    Task<OperationResult<DayAvailabilityDto>> DeleteDaysAsync(
        Guid mentorId,
        DaysAvailabilityDeleteRequestDto days
    );
}
