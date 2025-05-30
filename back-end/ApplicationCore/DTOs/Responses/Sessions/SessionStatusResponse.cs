using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Sessions
{
    public class SessionStatusResponse
    {
        public Guid UserId { get; set; }
        public required string FullName { get; set; }
        public Guid SessionId { get; set; }
        public required SessionBookingStatus SessionStatus { get; set; }
    }
}