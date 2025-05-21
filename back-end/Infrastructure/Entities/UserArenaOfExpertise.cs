namespace Infrastructure.Entities
{
    public class UserArenaOfExpertise
    {
        public Guid UserProfileId { get; set; }
        public Guid ArenaOfExpertiseId { get; set; }

        public virtual UserProfile UserProfile { get; set; } = null!;
        public virtual ArenaOfExpertise ArenaOfExpertise { get; set; } = null!;
    }
}
