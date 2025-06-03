using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ISessionBookingService
    {
        Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest);
        Task<OperationResult<PagedResult<MentorBookingDetailsDto>>> GetBookingsForMentorAsync(Guid userId, MentorBookingsQueryParameters queryParameters);
        Task<OperationResult<UpdateBookingResponseDto>> RescheduleBookingByMentorAsync(Guid sessionId, Guid mentorId, RescheduleBookingRequestDto rescheduleRequest);
        Task<OperationResult<UpdateBookingResponseDto>> UpdateBookingStatusAsync(Guid sessionId, Guid userId, UpdateBookingStatusRequestDto updateRequest);
        Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request);

    }
}
