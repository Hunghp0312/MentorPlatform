using ApplicationCore.DTOs.Responses.Sessions;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class SessionMappingExtension
    {
        public static SessionStatusResponse ToSessionStatusResponse(this SessionBooking session)
        {
            if (session == null)
            {
                throw new ArgumentNullException(nameof(session), "Session cannot be null.");
            }
            return new SessionStatusResponse
            {
                MentorId = session.MentorId,
                FullName = session.Mentor?.UserProfile?.FullName ?? string.Empty,
                SessionId = session.Id,
                SessionStatus = session.Status
            };
        }
        public static List<SessionStatusResponse> ToSessionStatusResponseList(this ICollection<SessionBooking> session)
        {
            return session.Select(s => s.ToSessionStatusResponse()).ToList();
        }
    }
}