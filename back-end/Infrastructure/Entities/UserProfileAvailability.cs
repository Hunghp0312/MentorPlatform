using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class UserProfileAvailability
    {
        public Guid UserId { get; set; }
        public virtual UserProfile UserProfile { get; set; } = null!;
        public int AvailabilityId { get; set; }
        public virtual Availability Availability { get; set; } = null!;
    }
}
