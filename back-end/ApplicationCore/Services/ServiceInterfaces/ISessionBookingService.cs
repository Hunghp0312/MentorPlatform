using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.SessionBookings;
using ApplicationCore.DTOs.Responses.SessionBookings;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ISessionBookingService
    {
        Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest);
    }
}
