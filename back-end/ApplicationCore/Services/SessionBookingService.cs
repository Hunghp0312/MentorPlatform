using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;


namespace ApplicationCore.Services
{
    public class SessionBookingService : ISessionBookingService
    {
        private readonly ISessionBookingRepository _sessionBookingRepository;
        private readonly IUnitOfWork _unitOfWork;
        public SessionBookingService(ISessionBookingRepository sessionBookingRepository, IUnitOfWork unitOfWork)
        {
            _sessionBookingRepository = sessionBookingRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request)
        {
            var session = await _sessionBookingRepository.GetByIdAsync(request.SessionId);
            if (session == null)
            {
                return OperationResult<SessionStatusResponse>.NotFound("Session not found");
            }
            var validationResult = ValidateStatusChange(session, request);
            if (validationResult != null)
            {
                return validationResult;
            }

            session.Id = request.SessionId;
            session.StatusId = request.StatusId;
            await _unitOfWork.BeginTransactionAsync();
            _sessionBookingRepository.Update(session);
            await _unitOfWork.SaveChangesAsync();

            var response = session.ToSessionStatusResponse();

            return OperationResult<SessionStatusResponse>.Ok(response);
        }
        private static OperationResult<SessionStatusResponse>? ValidateStatusChange(SessionBooking session, SessionUpdateStatusRequest request)
        {
            if (request.StatusId <= 3 || request.StatusId > 6)
            {
                return OperationResult<SessionStatusResponse>.BadRequest("Invalid status ID provided.");
            }

            if (session.StatusId == request.StatusId)
            {
                return OperationResult<SessionStatusResponse>.BadRequest("The session is already in the requested status.");
            }

            if (session.StatusId == 5 ||
                session.StatusId == 4)
            {
                return OperationResult<SessionStatusResponse>.BadRequest("Cannot change status from Completed or Cancelled.");
            }

            return null;
        }

        public async Task<OperationResult<SessionStatusCountResponse>> GetSessionStatusCounts()
        {
            var session = await _sessionBookingRepository.GetAllAsync();
            var upcomingSessions = session.Count(s => s.StatusId == 6);
            var pastSessions = session.Count(s => s.StatusId == 5 || s.StatusId == 4);
            var response = new SessionStatusCountResponse
            {
                UpcomingSessionCount = upcomingSessions,
                PastSessionCount = pastSessions,
            };

            return OperationResult<SessionStatusCountResponse>.Ok(response);
        }

        public async Task<OperationResult<PagedResult<SessionStatusResponse>>> GetAllSessions(PaginationParameters paginationParameters, int sessionStatus)
        {
            if (sessionStatus != 4 && sessionStatus != 5 && sessionStatus != 6)
            {
                return OperationResult<PagedResult<SessionStatusResponse>>.BadRequest("Invalid session status. Only statuses 4 (Cancelled), 5 (Completed), or 6 (Scheduled) are allowed.");
            }

            Func<IQueryable<SessionBooking>, IQueryable<SessionBooking>> filter = q => q.Where(s => s.StatusId == sessionStatus);

            var (sessions, totalCount) = await _sessionBookingRepository.GetPagedAsync(
                filter,
                paginationParameters.PageIndex,
                paginationParameters.PageSize
            );

            var pagedResult = new PagedResult<SessionStatusResponse>
            {
                Items = sessions.ToSessionStatusResponseList(),
                PageIndex = paginationParameters.PageIndex,
                PageSize = paginationParameters.PageSize,
                TotalItems = totalCount
            };

            return OperationResult<PagedResult<SessionStatusResponse>>.Ok(pagedResult);
        }
    }
}
