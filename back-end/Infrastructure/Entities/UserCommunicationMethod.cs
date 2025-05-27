using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class UserCommunicationMethod
    {
        public Guid UseProfileId { get; set; }
        public int CommunicationMethodId { get; set; }
        public virtual UserProfile UserProfile { get; set; } = null!;
        public virtual CommunicationMethod CommunicationMethod { get; set; } = null!;
    }
}
