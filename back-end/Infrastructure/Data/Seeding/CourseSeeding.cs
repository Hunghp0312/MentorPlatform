using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class CourseSeeding
    {
        public static List<Course> SeedCourses()
        {
            var fixedDate = new DateTime(2025, 5, 14, 0, 0, 0, DateTimeKind.Utc);
            return new List<Course>
            {
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72848"),
                    Name = "Intro to C#",
                    Description = "Learn the fundamentals of C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    StatusId = 2,
                    LevelId = 1,
                    Duration = "3 weeks",
                    Tags = "C#,programming,fundamentals",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72847"),
                    Name = "OOP in C#",
                    Description = "Master object-oriented programming concepts in C#.",
                    CategoryId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    StatusId = 1,
                    LevelId = 2,
                    Duration = "4 weeks",
                    Tags = "C#,OOP,classes,inheritance",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72846"),
                    Name = "Advanced .NET APIs",
                    Description = "Build and deploy RESTful APIs using ASP.NET Core.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    StatusId = 2,
                    LevelId = 3,
                    Duration = "5 weeks",
                    Tags = ".NET,ASP.NET Core,API,REST",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72845"),
                    Name = "SQL for Beginners",
                    Description = "Understand SQL basics and database querying.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    StatusId = 3,
                    LevelId = 1,
                    Duration = "2 weeks",
                    Tags = "SQL,database,queries,beginner",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72844"),
                    Name = "EF Core Masterclass",
                    Description = "Master Entity Framework Core for modern data access.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    StatusId = 2,
                    LevelId = 2,
                    Duration = "4 weeks",
                    Tags = "EF Core,Entity Framework,data access,.NET",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72843"),
                    Name = "HTML & CSS Basics",
                    Description = "Create beautiful static websites using HTML and CSS.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    StatusId = 1,
                    LevelId = 1,
                    Duration = "2 weeks",
                    Tags = "HTML,CSS,web design,frontend",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000006"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72842"),
                    Name = "React Essentials",
                    Description = "Learn how to build reactive UIs using React.",
                    CategoryId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    StatusId = 2,
                    LevelId = 2,
                    Duration = "4 weeks",
                    Tags = "React,JavaScript,frontend,UI",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72841"),
                    Name = "Unit Testing in .NET",
                    Description = "Write unit tests and follow TDD in .NET.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    StatusId = 2,
                    LevelId = 2,
                    Duration = "3 weeks",
                    Tags = ".NET,testing,TDD,unit tests",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000008"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72840"),
                    Name = "Git & GitHub Basics",
                    Description = "Master version control with Git and GitHub.",
                    CategoryId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    StatusId = 3,
                    LevelId = 1,
                    Duration = "1 week",
                    Tags = "Git,GitHub,version control,beginner",
                    Created = fixedDate,
                    LastUpdated = fixedDate,
                    MentorId = Guid.Parse("10000000-0000-0000-0000-000000000009"),
                },
                new Course
                {
                    Id = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72849"),
                    Name = "Docker for Developers",
                    Description = "Containerize and deploy apps with Docker.",
                    CategoryId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    StatusId = 1,
                    LevelId = 3,
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
