using ApplicationCore.Entity;

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
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Name = "Web Development",
                    Description = "Frontend and backend development tutorials and courses.",
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Name = "Data Science",
                    Description = "Learn data analysis, visualization, and machine learning.",
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Name = "DevOps",
                    Description = "Courses on CI/CD, containers, and infrastructure automation.",
                    Status = CategoryStatus.Inactive,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Name = "Databases",
                    Description = "Introduction to relational and non-relational databases.",
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Name = "Frontend",
                    Description = "Courses on HTML, CSS, JavaScript and modern frameworks.",
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Backend",
                    Description = "Learn backend technologies and server-side programming.",
                    Status = CategoryStatus.Inactive,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Mobile Development",
                    Description = "Build apps for iOS and Android platforms.",
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "Cloud Computing",
                    Description = "Explore AWS, Azure, GCP and cloud infrastructure.",
                    Status = CategoryStatus.Inactive,
                    CourseCount = 0,
                },
                new Category
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Name = "Cybersecurity",
                    Description = "Understand security principles and ethical hacking.",
                    Status = CategoryStatus.Active,
                    CourseCount = 0,
                },
            };
        }
    }
}
