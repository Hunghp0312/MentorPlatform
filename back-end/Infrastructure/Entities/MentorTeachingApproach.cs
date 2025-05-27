using Infrastructure.Entities.Enum;
namespace Infrastructure.Entities
{
    public class MentorTeachingApproach
    {
        public Guid UserProfileId { get; set; }
        public int TeachingApproachId { get; set; }
        public virtual UserProfile UserProfile { get; set; } = null!;
        public virtual TeachingApproach TeachingApproach { get; set; } = null!;

    }
}