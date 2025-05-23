using Infrastructure.Entities.Enum;

namespace Infrastructure.Data.Seeding
{
    public static class ArenaOfExpertiseSeeding
    {
        public static List<ArenaOfExpertise> SeedArenasOfExpertise()
        {
            return new List<ArenaOfExpertise>
            {
                new ArenaOfExpertise { Id = 1, Name = "Leadership" },
                new ArenaOfExpertise { Id = 2, Name = "Programming" },
                new ArenaOfExpertise { Id = 3, Name = "Design" },
                new ArenaOfExpertise { Id = 4, Name = "Marketing" },
                new ArenaOfExpertise { Id = 5, Name = "Data Science" },
                new ArenaOfExpertise { Id = 6, Name = "Business" },
                new ArenaOfExpertise { Id = 7, Name = "Project Management" },
                new ArenaOfExpertise { Id = 8, Name = "Communication" }
            };
        }
    }
}
