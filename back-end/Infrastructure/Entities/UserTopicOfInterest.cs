namespace Infrastructure.Entities
{
    public class UserTopicOfInterest
    {
        public Guid UserId { get; set; }
        public Guid TopicId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Topic Topic { get; set; } = null!;
    }
}
