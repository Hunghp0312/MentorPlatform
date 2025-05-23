using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class CategorySeeding
    {
        public static List<Category> SeedCategories()
        {
            return new List<Category>
            {
                new Category
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Name = "Programming",
                    Description =
                        "Courses related to software development and programming languages.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Name = "Web Development",
                    Description = "Frontend and backend development tutorials and courses.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Name = "Data Science",
                    Description = "Learn data analysis, visualization, and machine learning.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Name = "DevOps",
                    Description = "Courses on CI/CD, containers, and infrastructure automation.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Name = "Databases",
                    Description = "Introduction to relational and non-relational databases.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Name = "Frontend",
                    Description = "Courses on HTML, CSS, JavaScript and modern frameworks.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Backend",
                    Description = "Learn backend technologies and server-side programming.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Mobile Development",
                    Description = "Build apps for iOS and Android platforms.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "Cloud Computing",
                    Description = "Explore AWS, Azure, GCP and cloud infrastructure.",
                    StatusId = 2,
                },
                new Category
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Name = "Cybersecurity",
                    Description = "Understand security principles and ethical hacking.",
                    StatusId = 2,
                },
            };
        }
    }
}