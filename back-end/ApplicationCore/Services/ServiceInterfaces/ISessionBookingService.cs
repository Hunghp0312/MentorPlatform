using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.SessionBookings;
using ApplicationCore.DTOs.Responses.SessionBookings;

using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ISessionBookingService
    {
        Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest);
        Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request);
    }
}
