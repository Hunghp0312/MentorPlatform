using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class UserAreaOfExpertise
    {
        public Guid UserId { get; set; }
        public int AreaOfExpertiseId { get; set; }
        public virtual User User { get; set; } = null!;
        public virtual AreaOfExpertise AreaOfExpertise { get; set; } = null!;
    }
}
