using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ISessionBookingService
    {
        Task<OperationResult<MentorBookingDetailsDto>> AcceptBookingAsync(Guid sessionId, Guid mentorId);
        Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest);
        Task<OperationResult<PagedResult<MentorBookingDetailsDto>>> GetBookingsForMentorAsync(Guid userId, MentorBookingsQueryParameters queryParameters);
        Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request);

    }
}
