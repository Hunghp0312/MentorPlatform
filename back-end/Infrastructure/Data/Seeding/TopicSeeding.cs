using Infrastructure.Entities.Enum;

namespace Infrastructure.Data.Seeding
{
    public static class TopicSeeding
    {
        public static List<Topic> SeedTopics()
        {
            return new List<Topic>
            {
                new Topic { Id = 1, Name = "Career Development" },
                new Topic { Id = 2, Name = "Technical Skills" },
                new Topic { Id = 3, Name = "Leadership" },
                new Topic { Id = 4, Name = "Communication" },
                new Topic { Id = 5, Name = "Work-Life Balance" },
                new Topic { Id = 6, Name = "Industry Insights" },
                new Topic { Id = 7, Name = "Networking" },
                new Topic { Id = 8, Name = "Entrepreneurship" }
            };
        }
    }
}
