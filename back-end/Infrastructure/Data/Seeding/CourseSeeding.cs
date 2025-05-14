using ApplicationCore.Entity;

namespace Infrastructure.Data.Seeding
{
    public static class CourseSeeding
    {
        public static List<Course> SeedCourses()
        {
            var fixedDate = new DateTime(2025, 5, 14, 0, 0, 0, DateTimeKind.Utc); // Static UTC date
            return new List<Course>
            {
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72848"),
                    Title = "Intro to C#",
                    Description = "Learn the fundamentals of C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginner,
                    Duration = "3 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                   Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72847"),
                    Title = "OOP in C#",
                    Description = "Master object-oriented programming concepts in C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "4 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                   Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72846"),
                    Title = "Advanced .NET APIs",
                    Description = "Build and deploy RESTful APIs using ASP.NET Core.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Advanced,
                    Duration = "5 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                   Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72845"),
                    Title = "SQL for Beginners",
                    Description = "Understand SQL basics and database querying.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginner,
                    Duration = "2 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                   Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72844"),
                    Title = "EF Core Masterclass",
                    Description = "Master Entity Framework Core for modern data access.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "4 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                   Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72843"),
                    Title = "HTML & CSS Basics",
                    Description = "Create beautiful static websites using HTML and CSS.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginner,
                    Duration = "2 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72842"),
                    Title = "React Essentials",
                    Description = "Learn how to build reactive UIs using React.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "4 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                   Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72841"),
                    Title = "Unit Testing in .NET",
                    Description = "Write unit tests and follow TDD in .NET.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Intermediate,
                    Duration = "3 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72840"),
                    Title = "Git & GitHub Basics",
                    Description = "Master version control with Git and GitHub.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Begginner,
                    Duration = "1 week",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72849"),
                    Title = "Docker for Developers",
                    Description = "Containerize and deploy apps with Docker.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Difficulty = CourseDifficulty.Advanced,
                    Duration = "3 weeks",
                    MentorId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    ResourceId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                },
            };
        }
    }
}
