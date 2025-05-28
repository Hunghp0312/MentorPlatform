using Infrastructure.Entities.Enum;

namespace Infrastructure.Data.Seeding
{
    public static class AreaOfExpertiseSeeding
    {
        public static List<AreaOfExpertise> SeedAreasOfExpertise()
        {
            return new List<AreaOfExpertise>
            {
                new AreaOfExpertise { Id = 1, Name = "Leadership" },
                new AreaOfExpertise { Id = 2, Name = "Programming" },
                new AreaOfExpertise { Id = 3, Name = "Design" },
                new AreaOfExpertise { Id = 4, Name = "Marketing" },
                new AreaOfExpertise { Id = 5, Name = "Data Science" },
                new AreaOfExpertise { Id = 6, Name = "Business" },
                new AreaOfExpertise { Id = 7, Name = "Project Management" },
                new AreaOfExpertise { Id = 8, Name = "Communication" }
            };
        }
    }
}
