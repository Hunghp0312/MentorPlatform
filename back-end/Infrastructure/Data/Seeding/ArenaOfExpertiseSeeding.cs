using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class ArenaOfExpertiseSeeding
    {
        public static List<ArenaOfExpertise> SeedArenasOfExpertise()
        {
            return new List<ArenaOfExpertise>
            {
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C1"), Name = "Leadership" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C2"), Name = "Programming" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C3"), Name = "Design" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C4"), Name = "Marketing" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C5"), Name = "Data Science" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C6"), Name = "Business" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C7"), Name = "Project Management" },
                new ArenaOfExpertise { Id = Guid.Parse("E0A0B0C0-D0E0-F0A0-B0C0-D0E0F0A0B0C8"), Name = "Communication" }
            };
        }
    }
}
