using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;

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

            session.Id = request.SessionId;
            session.StatusId = request.StatusId;

            var response = new SessionStatusResponse
            {
                UserId = request.UserId,
                FullName = session.Mentor.UserProfile?.FullName ?? string.Empty,
                SessionId = session.Id,
                SessionStatus = session.Status
            };

            _sessionBookingRepository.Update(session);
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<SessionStatusResponse>.Ok(response);
        }
    }
}
