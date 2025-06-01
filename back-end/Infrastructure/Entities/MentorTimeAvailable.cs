using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class MentorTimeAvailable
    {
        public Guid Id { get; set; }
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }
        public Guid DayId { get; set; }
        public MentorDayAvailable MentorDayAvailable { get; set; } = null!;
        public virtual ICollection<SessionBooking> SessionBookings { get; set; } =
            new List<SessionBooking>();
        public int StatusId { get; set; }
        public SessionAvailabilityStatus Status { get; set; } = default!;
    }
}
