using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class UserTopicOfInterest
    {
        public Guid UserProfileId { get; set; }
        public int TopicId { get; set; }
        public virtual UserProfile UserProfile { get; set; } = null!;
        public virtual Topic Topic { get; set; } = null!;
    }
}
