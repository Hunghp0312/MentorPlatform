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
                LearnerId = session.LearnerId,
                FullName = session.Learner?.UserProfile?.FullName ?? string.Empty,
                SessionId = session.Id,
                SessionStatus = session.Status,
                SessionType = session.SessionType,
                SlotStartTime = session.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(session.MentorTimeAvailable.Start, DateTimeKind.Utc),
                SlotEndTime = session.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(session.MentorTimeAvailable.End, DateTimeKind.Utc),
                BookingDay = session.MentorTimeAvailable.MentorDayAvailable.Day,
            };
        }
        public static List<SessionStatusResponse> ToSessionStatusResponseList(this ICollection<SessionBooking> session)
        {
            return session.Select(s => s.ToSessionStatusResponse()).ToList();
        }
    }
}