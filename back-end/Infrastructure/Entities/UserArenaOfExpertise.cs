using Infrastructure.Entities.Enum;
namespace Infrastructure.Entities
{
    public class UserArenaOfExpertise
    {
        public Guid UserId { get; set; }
        public int ArenaOfExpertiseId { get; set; }
        public virtual User User { get; set; } = null!;
        public virtual ArenaOfExpertise ArenaOfExpertise { get; set; } = null!;
    }
}
