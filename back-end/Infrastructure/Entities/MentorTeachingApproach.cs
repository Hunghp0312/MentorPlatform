using Infrastructure.Entities.Enum;
namespace Infrastructure.Entities
{
    public class MentorTeachingApproach
    {
        public Guid UserId { get; set; }
        public int TeachingApproachId { get; set; }
        public virtual User User { get; set; } = null!;
        public virtual TeachingApproach TeachingApproach { get; set; } = null!;

    }
}