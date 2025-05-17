using ApplicationCore.Common;
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
                    Level = CourseLevel.Begginner,
                    Duration = "3 weeks",
                    Tags = "C#,programming,fundamentals",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72847"),
                    Title = "OOP in C#",
                    Description = "Master object-oriented programming concepts in C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Intermediate,
                    Duration = "4 weeks",
                    Tags = "C#,OOP,classes,inheritance",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72846"),
                    Title = "Advanced .NET APIs",
                    Description = "Build and deploy RESTful APIs using ASP.NET Core.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Advanced,
                    Duration = "5 weeks",
                    Tags = ".NET,ASP.NET Core,API,REST",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72845"),
                    Title = "SQL for Beginners",
                    Description = "Understand SQL basics and database querying.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Begginner,
                    Duration = "2 weeks",
                    Tags = "SQL,database,queries,beginner",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72844"),
                    Title = "EF Core Masterclass",
                    Description = "Master Entity Framework Core for modern data access.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Intermediate,
                    Duration = "4 weeks",
                    Tags = "EF Core,Entity Framework,data access,.NET",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72843"),
                    Title = "HTML & CSS Basics",
                    Description = "Create beautiful static websites using HTML and CSS.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Begginner,
                    Duration = "2 weeks",
                    Tags = "HTML,CSS,web design,frontend",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000006"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72842"),
                    Title = "React Essentials",
                    Description = "Learn how to build reactive UIs using React.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Intermediate,
                    Duration = "4 weeks",
                    Tags = "React,JavaScript,frontend,UI",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72841"),
                    Title = "Unit Testing in .NET",
                    Description = "Write unit tests and follow TDD in .NET.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Intermediate,
                    Duration = "3 weeks",
                    Tags = ".NET,testing,TDD,unit tests",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000008"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72840"),
                    Title = "Git & GitHub Basics",
                    Description = "Master version control with Git and GitHub.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Begginner,
                    Duration = "1 week",
                    Tags = "Git,GitHub,version control,beginner",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000009"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72849"),
                    Title = "Docker for Developers",
                    Description = "Containerize and deploy apps with Docker.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Status = CourseStatus.Published,
                    Level = CourseLevel.Advanced,
                    Duration = "3 weeks",
                    Tags = "Docker,containers,devops,deployment",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000010"),
                },
            };
        }
    }
}
