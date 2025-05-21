namespace Infrastructure.Entities
{
    public class ArenaOfExpertise
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<UserArenaOfExpertise> UserArenaOfExpertises { get; set; } = new List<UserArenaOfExpertise>();
    }
}
