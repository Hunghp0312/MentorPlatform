namespace Infrastructure.Entities
{
    public class UserArenaOfExpertise
    {
        public Guid UserId { get; set; }
        public Guid ArenaOfExpertiseId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual ArenaOfExpertise ArenaOfExpertise { get; set; } = null!;
    }
}
