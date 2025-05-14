using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CourseCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Course",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Difficulty = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MentorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Course_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "CourseCount", "Description", "Name", "Status" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), 0, "Learn backend technologies and server-side programming.", "Backend", 0 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), 0, "Build apps for iOS and Android platforms.", "Mobile Development", 0 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), 0, "Explore AWS, Azure, GCP and cloud infrastructure.", "Cloud Computing", 0 },
                    { new Guid("44444444-4444-4444-4444-444444444444"), 0, "Understand security principles and ethical hacking.", "Cybersecurity", 0 },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 0, "Courses related to software development and programming languages.", "Programming", 0 },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), 0, "Frontend and backend development tutorials and courses.", "Web Development", 0 },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 0, "Learn data analysis, visualization, and machine learning.", "Data Science", 0 },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), 0, "Courses on CI/CD, containers, and infrastructure automation.", "DevOps", 0 },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), 0, "Introduction to relational and non-relational databases.", "Databases", 0 },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), 0, "Courses on HTML, CSS, JavaScript and modern frameworks.", "Frontend", 0 }
                });

            migrationBuilder.InsertData(
                table: "Course",
                columns: new[] { "Id", "CategoryId", "Created", "Description", "Difficulty", "Duration", "LastUpdated", "MentorId", "ResourceId", "Status", "Title" },
                values: new object[,]
                {
                    { new Guid("07096c17-a6e7-4aa8-a58e-81f35f2d9490"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8790), "Containerize and deploy apps with Docker.", 2, "3 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8790), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "Docker for Developers" },
                    { new Guid("0aee98cb-b52a-456b-be3f-6951f9df1832"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8763), "Create beautiful static websites using HTML and CSS.", 0, "2 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8763), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "HTML & CSS Basics" },
                    { new Guid("197dd9d2-6232-43f2-9954-50f2964a90bc"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8726), "Master object-oriented programming concepts in C#.", 1, "4 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8727), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "OOP in C#" },
                    { new Guid("202ae676-3b00-4bac-87ab-07b6b21f059a"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8734), "Build and deploy RESTful APIs using ASP.NET Core.", 2, "5 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8734), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "Advanced .NET APIs" },
                    { new Guid("270936ae-c79c-43fe-acb7-d418efd402bb"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8304), "Learn the fundamentals of C#.", 0, "3 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8503), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "Intro to C#" },
                    { new Guid("4f7e1a91-75bb-4705-83ce-63f4fd9129f8"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8741), "Understand SQL basics and database querying.", 0, "2 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8741), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "SQL for Beginners" },
                    { new Guid("595ccb25-4459-494d-8bce-1cdd688260a7"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8782), "Master version control with Git and GitHub.", 0, "1 week", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8782), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "Git & GitHub Basics" },
                    { new Guid("708d6339-6961-4b92-80fa-c73fc7479e43"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8748), "Master Entity Framework Core for modern data access.", 1, "4 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8748), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "EF Core Masterclass" },
                    { new Guid("ce739c1f-bb6b-4d4d-9029-1766f49ee594"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8769), "Learn how to build reactive UIs using React.", 1, "4 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8769), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "React Essentials" },
                    { new Guid("ffd65ae2-caba-449f-bd16-4e2b4a97bf6d"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8776), "Write unit tests and follow TDD in .NET.", 1, "3 weeks", new DateTime(2025, 5, 14, 7, 21, 13, 196, DateTimeKind.Utc).AddTicks(8776), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, "Unit Testing in .NET" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Course_CategoryId",
                table: "Course",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Course");

            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}
