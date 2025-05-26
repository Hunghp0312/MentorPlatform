using Infrastructure.Entities.Enum;

namespace Infrastructure.Data.Seeding
{
    public class AvailabilitySeeding
    {
        public static List<Availability> SeedAvailability()
        {
            return new List<Availability>
            {
               new Availability { Id = 1, Name = "Weekdays" },
                new Availability { Id = 2, Name = "Weekends" },
                new Availability { Id = 3, Name = "Mornings" },
                new Availability { Id = 4, Name = "Afternoons" },
                new Availability { Id = 5, Name = "Evenings" }
            };
        }
    }
}