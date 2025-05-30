using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class SessionBooking
    {
        public Guid Id { get; set; }
        public string? LearnerMessage { get; set; }
        public string? CancelReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid LearnerId { get; set; }
        public Guid MentorId { get; set; }
        public Guid AvailabilitySlotId { get; set; }
        public int StatusId { get; set; }
        public int SessionTypeId { get; set; }
        public virtual User Learner { get; set; } = null!;
        public virtual User Mentor { get; set; } = null!;
        public virtual MentorAvailabilitySlot AvailabilitySlot { get; set; } = null!;
        public SessionBookingStatus Status { get; set; } = null!;
        public SessionType SessionType { get; set; } = null!;
    }
}
