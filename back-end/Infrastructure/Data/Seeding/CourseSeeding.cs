using ApplicationCore.Entity;

namespace Infrastructure.Data.Seeding
{
    public static class CourseSeeding
    {
        public static List<Course> SeedCourses()
        {
            return new List<Course>
            {
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "Intro to C#",
                    Description = "Learn the fundamentals of C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginer,
                    Duration = "3 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "OOP in C#",
                    Description = "Master object-oriented programming concepts in C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "4 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "Advanced .NET APIs",
                    Description = "Build and deploy RESTful APIs using ASP.NET Core.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Advanced,
                    Duration = "5 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "SQL for Beginners",
                    Description = "Understand SQL basics and database querying.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginer,
                    Duration = "2 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "EF Core Masterclass",
                    Description = "Master Entity Framework Core for modern data access.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "4 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "HTML & CSS Basics",
                    Description = "Create beautiful static websites using HTML and CSS.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginer,
                    Duration = "2 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "React Essentials",
                    Description = "Learn how to build reactive UIs using React.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "4 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "Unit Testing in .NET",
                    Description = "Write unit tests and follow TDD in .NET.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "3 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "Git & GitHub Basics",
                    Description = "Master version control with Git and GitHub.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginer,
                    Duration = "1 week",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
                new Course
                {
                    Id = Guid.NewGuid(),
                    Title = "Docker for Developers",
                    Description = "Containerize and deploy apps with Docker.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Advanced,
                    Duration = "3 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                },
            };
        }
    }
}
