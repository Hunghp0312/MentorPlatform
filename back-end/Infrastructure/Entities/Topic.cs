namespace Infrastructure.Entities
{
    public class Topic
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation Property
        public virtual ICollection<UserTopicOfInterest> UserTopicOfInterests { get; set; } = new List<UserTopicOfInterest>();
    }
}
