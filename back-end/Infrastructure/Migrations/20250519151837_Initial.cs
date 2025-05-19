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
                name: "CategoryStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CourseLevel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseLevel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CourseStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Category_CategoryStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "CategoryStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Course",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    LevelId = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MentorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Course_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Course_CourseLevel_LevelId",
                        column: x => x.LevelId,
                        principalTable: "CourseLevel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Course_CourseStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "CourseStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "CategoryStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Inactive" },
                    { 2, "Active" }
                });

            migrationBuilder.InsertData(
                table: "CourseLevel",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Beginner" },
                    { 2, "Intermediate" },
                    { 3, "Advanced" }
                });

            migrationBuilder.InsertData(
                table: "CourseStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Draft" },
                    { 2, "Published" },
                    { 3, "Archived" }
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "Description", "Name", "StatusId" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Learn backend technologies and server-side programming.", "Backend", 1 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Build apps for iOS and Android platforms.", "Mobile Development", 2 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Explore AWS, Azure, GCP and cloud infrastructure.", "Cloud Computing", 1 },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Understand security principles and ethical hacking.", "Cybersecurity", 2 },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Courses related to software development and programming languages.", "Programming", 2 },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Frontend and backend development tutorials and courses.", "Web Development", 2 },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Learn data analysis, visualization, and machine learning.", "Data Science", 2 },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "Courses on CI/CD, containers, and infrastructure automation.", "DevOps", 1 },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), "Introduction to relational and non-relational databases.", "Databases", 2 },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), "Courses on HTML, CSS, JavaScript and modern frameworks.", "Frontend", 2 }
                });

            migrationBuilder.InsertData(
                table: "Course",
                columns: new[] { "Id", "CategoryId", "Created", "Description", "Duration", "LastUpdated", "LevelId", "MentorId", "StatusId", "Tags", "Title" },
                values: new object[,]
                {
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72840"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master version control with Git and GitHub.", "1 week", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000009"), 2, "Git,GitHub,version control,beginner", "Git & GitHub Basics" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72841"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Write unit tests and follow TDD in .NET.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000008"), 2, ".NET,testing,TDD,unit tests", "Unit Testing in .NET" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72842"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Learn how to build reactive UIs using React.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000007"), 2, "React,JavaScript,frontend,UI", "React Essentials" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72843"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Create beautiful static websites using HTML and CSS.", "2 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000006"), 2, "HTML,CSS,web design,frontend", "HTML & CSS Basics" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72844"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master Entity Framework Core for modern data access.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000005"), 2, "EF Core,Entity Framework,data access,.NET", "EF Core Masterclass" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72845"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Understand SQL basics and database querying.", "2 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000004"), 2, "SQL,database,queries,beginner", "SQL for Beginners" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72846"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Build and deploy RESTful APIs using ASP.NET Core.", "5 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("10000000-0000-0000-0000-000000000003"), 2, ".NET,ASP.NET Core,API,REST", "Advanced .NET APIs" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72847"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master object-oriented programming concepts in C#.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000002"), 2, "C#,OOP,classes,inheritance", "OOP in C#" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72848"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Learn the fundamentals of C#.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000001"), 2, "C#,programming,fundamentals", "Intro to C#" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72849"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Containerize and deploy apps with Docker.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("10000000-0000-0000-0000-000000000010"), 2, "Docker,containers,devops,deployment", "Docker for Developers" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_StatusId",
                table: "Category",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_CategoryId",
                table: "Course",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_LevelId",
                table: "Course",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_StatusId",
                table: "Course",
                column: "StatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Course");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "CourseLevel");

            migrationBuilder.DropTable(
                name: "CourseStatus");

            migrationBuilder.DropTable(
                name: "CategoryStatus");
        }
    }
}
