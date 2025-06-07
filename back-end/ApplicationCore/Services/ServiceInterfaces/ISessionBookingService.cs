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
        Task<OperationResult<SessionStatusCountResponse>> GetSessionStatusCounts();
        Task<OperationResult<PagedResult<SessionStatusResponse>>> GetAllSessions(SessionQueryParameters paginationParameters, Guid mentorId);
        Task<OperationResult<PagedResult<UpcomingSessionDto>>> GetSessionDashBoardAsync(Guid userId, PaginationParameters paginationParameters);
    }
}
