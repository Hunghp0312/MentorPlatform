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

    Task<OperationResult<string>> SaveMentorDaysAvailability(
        Guid mentorId,
        SaveDaysAvailabilityRequestDto requestDto
    );

    Task<OperationResult<DayAvailabilityDto>> GetDayAvailabilityAsync(Guid mentorId, DateOnly day);
}
