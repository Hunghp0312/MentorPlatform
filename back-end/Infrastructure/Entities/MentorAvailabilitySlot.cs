using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class MentorAvailabilitySlot
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int StatusId { get; set; } = default!;
        public Guid MentorId { get; set; }
        public virtual User Mentor { get; set; } = null!;
        public virtual ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();
        public SessionAvailabilityStatus Status { get; set; } = default!;
    }
}
