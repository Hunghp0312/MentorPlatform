using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface ISessionBookingService
    {
        Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request);
        Task<OperationResult<SessionStatusCountResponse>> GetSessionStatusCounts();
        Task<OperationResult<PagedResult<SessionStatusResponse>>> GetAllSessions(PaginationParameters paginationParameters, int sessionStatus);
    }
}
