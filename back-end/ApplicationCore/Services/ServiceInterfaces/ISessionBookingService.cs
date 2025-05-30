using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ISessionBookingService
    {
        Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request);
    }
}
