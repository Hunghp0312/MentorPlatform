using Infrastructure.Entities.Enum;

namespace Infrastructure.Data.Seeding
{
    public class TeachingApproachSeeding
    {
        public static List<TeachingApproach> SeedTeachingApproaches()
        {
            return new List<TeachingApproach>
            {
               new TeachingApproach { Id = 1, Name = "Hands-on Practice" },
                new TeachingApproach { Id = 2, Name = "Project Based" },
                new TeachingApproach { Id = 3, Name = "Disscussion Based" },
                new TeachingApproach { Id = 4, Name = "Lecture Style" },
            };
        }
    }
}