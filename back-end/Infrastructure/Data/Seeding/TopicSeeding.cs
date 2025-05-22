using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class TopicSeeding
    {
        public static List<Topic> SeedTopics()
        {
            return new List<Topic>
            {
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D1"), Name = "Career Development" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D2"), Name = "Technical Skills" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D3"), Name = "Leadership" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D4"), Name = "Communication" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D5"), Name = "Work-Life Balance" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D6"), Name = "Industry Insights" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D7"), Name = "Networking" },
                new Topic { Id = Guid.Parse("F0B1C2D3-E4F5-A6B7-C8D9-E0F1A2B3C4D8"), Name = "Entrepreneurship" }
            };
        }
    }
}
