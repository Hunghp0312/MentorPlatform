using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Availability;
using ApplicationCore.DTOs.Responses.Availability;

namespace ApplicationCore.Services.ServiceInterfaces;

public interface IAvailabilityService
{
    Task<OperationResult<WeekAvailabilityResponseDto>> GetWeekAvailabilityAsync(Guid mentorId, DateOnly weekStartDate);

    Task<OperationResult<WeekAvailabilityResponseDto>> SaveWeekAvailabilityAsync(SaveWeekAvailabilityRequestDto requestDto);

    Task<OperationResult<ScheduleConfigurationResponseDto>> UpdateScheduleConfigurationAsync(Guid mentorId, UpdateScheduleConfigurationRequestDto requestDto);
}