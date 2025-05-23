﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initital : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ArenaOfExpertise",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArenaOfExpertise", x => x.Id);
                });

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
                name: "DocumentContent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentContent", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Topic",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topic", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
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
                name: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PasswordResetToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PasswordResetExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Course",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    LevelId = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MentorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_Course_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MentorApplication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationStatusId = table.Column<int>(type: "int", nullable: false),
                    MotivationStatement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubmissionDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastStatusUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdminReviewerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AdminComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorApplication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorApplication_ApplicationStatus_ApplicationStatusId",
                        column: x => x.ApplicationStatusId,
                        principalTable: "ApplicationStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MentorApplication_User_AdminReviewerId",
                        column: x => x.AdminReviewerId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_MentorApplication_User_ApplicantId",
                        column: x => x.ApplicantId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserArenaOfExpertise",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ArenaOfExpertiseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserArenaOfExpertise", x => new { x.UserId, x.ArenaOfExpertiseId });
                    table.ForeignKey(
                        name: "FK_UserArenaOfExpertise_ArenaOfExpertise_ArenaOfExpertiseId",
                        column: x => x.ArenaOfExpertiseId,
                        principalTable: "ArenaOfExpertise",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserArenaOfExpertise_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PhotoData = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ProfessionalSkill = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IndustryExperience = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    AvailabilityData = table.Column<int>(type: "int", nullable: true),
                    UserGoal = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SessionFrequency = table.Column<int>(type: "int", nullable: true),
                    SessionDuration = table.Column<int>(type: "int", nullable: true),
                    LearningStyle = table.Column<int>(type: "int", nullable: true),
                    TeachingApproach = table.Column<int>(type: "int", nullable: true),
                    PrivacyProfile = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    MessagePermission = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    NotificationsEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CommunicationMethod = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfile_User_Id",
                        column: x => x.Id,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTopicOfInterest",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TopicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTopicOfInterest", x => new { x.UserId, x.TopicId });
                    table.ForeignKey(
                        name: "FK_UserTopicOfInterest_Topic_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTopicOfInterest_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Resource",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: true),
                    ResourceCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DocumentContentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resource", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Resource_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Resource_DocumentContent_DocumentContentId",
                        column: x => x.DocumentContentId,
                        principalTable: "DocumentContent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentorCertification",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CertificationName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IssuingOrganization = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorCertification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorCertification_MentorApplication_MentorApplicationId",
                        column: x => x.MentorApplicationId,
                        principalTable: "MentorApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentorEducation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstitutionName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FieldOfStudy = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    GraduationYear = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorEducation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorEducation_MentorApplication_MentorApplicationId",
                        column: x => x.MentorApplicationId,
                        principalTable: "MentorApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentorWorkExperience",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Position = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorWorkExperience", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorWorkExperience_MentorApplication_MentorApplicationId",
                        column: x => x.MentorApplicationId,
                        principalTable: "MentorApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SupportingDocument",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DocumentContentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportingDocument", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupportingDocument_DocumentContent_DocumentContentId",
                        column: x => x.DocumentContentId,
                        principalTable: "DocumentContent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SupportingDocument_MentorApplication_MentorApplicationId",
                        column: x => x.MentorApplicationId,
                        principalTable: "MentorApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ApplicationStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Pending" },
                    { 2, "Rejected" },
                    { 3, "Approved" }
                });

            migrationBuilder.InsertData(
                table: "ArenaOfExpertise",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c1"), "Leadership" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c2"), "Programming" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c3"), "Design" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c4"), "Marketing" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c5"), "Data Science" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c6"), "Business" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c7"), "Project Management" },
                    { new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c8"), "Communication" }
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
                table: "Role",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Learner" },
                    { 3, "Mentor" }
                });

            migrationBuilder.InsertData(
                table: "Topic",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d1"), "Career Development" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d2"), "Technical Skills" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d3"), "Leadership" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d4"), "Communication" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d5"), "Work-Life Balance" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d6"), "Industry Insights" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d7"), "Networking" },
                    { new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d8"), "Entrepreneurship" }
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "Description", "Name", "StatusId" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Learn backend technologies and server-side programming.", "Backend", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Build apps for iOS and Android platforms.", "Mobile Development", 2 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Explore AWS, Azure, GCP and cloud infrastructure.", "Cloud Computing", 2 },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Understand security principles and ethical hacking.", "Cybersecurity", 2 },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Courses related to software development and programming languages.", "Programming", 2 },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Frontend and backend development tutorials and courses.", "Web Development", 2 },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Learn data analysis, visualization, and machine learning.", "Data Science", 2 },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "Courses on CI/CD, containers, and infrastructure automation.", "DevOps", 2 },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), "Introduction to relational and non-relational databases.", "Databases", 2 },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), "Courses on HTML, CSS, JavaScript and modern frameworks.", "Frontend", 2 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Email", "LastLogin", "PasswordHash", "PasswordResetExpiry", "PasswordResetToken", "RefreshToken", "RefreshTokenExpiryTime", "RoleId" },
                values: new object[,]
                {
                    { new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"), "minhchau.admin@gmail.com", null, "mx31ZEfKpYBolnpQdU24oZr6J8rgcmeekox8OBXQjETbsl4JcFqFbX6VwbrRUngk", null, null, null, null, 1 },
                    { new Guid("03ea823d-d625-448d-901d-411c5028b769"), "huynguyen.mentor@gmail.com", null, "S5oA4POvzUKSeBQTJCs3YrB7T6reeQXFhqLhq9FVjt8iPCwLLijsfrdYVKZDjYaU", null, null, null, null, 3 },
                    { new Guid("0dd85da0-9214-419e-aa02-adefac68c264"), "dancega713@gmail.com", null, "r0e+UhrOsii3FlfUcY8OKkdRK1bc5komYpbONiqqJYj6qD78uz9oc+1XH+3IiEZw", null, null, null, null, 2 },
                    { new Guid("148b5a81-90d6-476d-9fee-747b834011ee"), "huynguyen.admin@gmail.com", null, "J24qoemyIGuKyAln3/Pi8RE91q37SzIJG73mRFp3NZdqEIACwi8kt+zwc2H83LoW", null, null, null, null, 1 },
                    { new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"), "huykhuong.admin@gmail.com", null, "MEO5BmXN7sVmKAnTj2gETwED6W21cDTnsB2r9wir+fLFKTHRsmuDEnA134c8XS7g", null, null, null, null, 1 },
                    { new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), "minhchau.mentor@gmail.com", null, "JusmH4xgMpPCqpXoHUmy5gIrmPE8Tn3FnmL4oJwoo5pdSUihid8bh2A8X47pDT0p", null, null, null, null, 3 },
                    { new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "huykhuong.mentor@gmail.com", null, "cfvPgZ274jQi71+hIv9qWL1GW4fl8c1krVlChe4zfN/W1GWQ+iI7hVe6acsAVs4r", null, null, null, null, 3 },
                    { new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"), "huynguyen.learner@gmail.com", null, "V5ValFHZWsVzHsJ1/kVQNY7voa9/s82t0wCoXgKANAmUV7jIXB3fSDqPrEWXyDQE", null, null, null, null, 2 },
                    { new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), "huykhuong.learner@gmail.com", null, "ij89QzFzzSDgkoM4/BxIQP/XGsF+jpIqE9jCQ54glK+RtGhTwWNA+tAgoq+VvcWP", null, null, null, null, 2 },
                    { new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"), "minhchau.learner@gmail.com", null, "PrMl19R6c0HX1trcVn7rrzICN0cwn9dfaVqYRy5MKE2ooPNFDCkNvOi3eYFQ+t3Y", null, null, null, null, 2 }
                });

            migrationBuilder.InsertData(
                table: "Course",
                columns: new[] { "Id", "CategoryId", "Created", "Description", "Duration", "LastUpdated", "LevelId", "MentorId", "Name", "StatusId", "Tags", "UserId" },
                values: new object[,]
                {
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72840"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master version control with Git and GitHub.", "1 week", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000009"), "Git & GitHub Basics", 3, "Git,GitHub,version control,beginner", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72841"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Write unit tests and follow TDD in .NET.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000008"), "Unit Testing in .NET", 2, ".NET,testing,TDD,unit tests", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72842"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Learn how to build reactive UIs using React.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000007"), "React Essentials", 2, "React,JavaScript,frontend,UI", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72843"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Create beautiful static websites using HTML and CSS.", "2 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000006"), "HTML & CSS Basics", 1, "HTML,CSS,web design,frontend", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72844"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master Entity Framework Core for modern data access.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000005"), "EF Core Masterclass", 2, "EF Core,Entity Framework,data access,.NET", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72845"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Understand SQL basics and database querying.", "2 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000004"), "SQL for Beginners", 3, "SQL,database,queries,beginner", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72846"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Build and deploy RESTful APIs using ASP.NET Core.", "5 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("10000000-0000-0000-0000-000000000003"), "Advanced .NET APIs", 2, ".NET,ASP.NET Core,API,REST", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72847"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master object-oriented programming concepts in C#.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("10000000-0000-0000-0000-000000000002"), "OOP in C#", 1, "C#,OOP,classes,inheritance", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72848"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Learn the fundamentals of C#.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("10000000-0000-0000-0000-000000000001"), "Intro to C#", 2, "C#,programming,fundamentals", null },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72849"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Containerize and deploy apps with Docker.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("10000000-0000-0000-0000-000000000010"), "Docker for Developers", 1, "Docker,containers,devops,deployment", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArenaOfExpertise_Name",
                table: "ArenaOfExpertise",
                column: "Name",
                unique: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Course_UserId",
                table: "Course",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication",
                column: "AdminReviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_ApplicantId",
                table: "MentorApplication",
                column: "ApplicantId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_ApplicationStatusId",
                table: "MentorApplication",
                column: "ApplicationStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorCertification_MentorApplicationId",
                table: "MentorCertification",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorEducation_MentorApplicationId",
                table: "MentorEducation",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorWorkExperience_MentorApplicationId",
                table: "MentorWorkExperience",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Resource_CourseId",
                table: "Resource",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Resource_DocumentContentId",
                table: "Resource",
                column: "DocumentContentId",
                unique: true,
                filter: "[DocumentContentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument",
                column: "DocumentContentId",
                unique: true,
                filter: "[DocumentContentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_MentorApplicationId",
                table: "SupportingDocument",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Topic_Name",
                table: "Topic",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserArenaOfExpertise_ArenaOfExpertiseId",
                table: "UserArenaOfExpertise",
                column: "ArenaOfExpertiseId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTopicOfInterest_TopicId",
                table: "UserTopicOfInterest",
                column: "TopicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MentorCertification");

            migrationBuilder.DropTable(
                name: "MentorEducation");

            migrationBuilder.DropTable(
                name: "MentorWorkExperience");

            migrationBuilder.DropTable(
                name: "Resource");

            migrationBuilder.DropTable(
                name: "SupportingDocument");

            migrationBuilder.DropTable(
                name: "UserArenaOfExpertise");

            migrationBuilder.DropTable(
                name: "UserProfile");

            migrationBuilder.DropTable(
                name: "UserTopicOfInterest");

            migrationBuilder.DropTable(
                name: "Course");

            migrationBuilder.DropTable(
                name: "DocumentContent");

            migrationBuilder.DropTable(
                name: "MentorApplication");

            migrationBuilder.DropTable(
                name: "ArenaOfExpertise");

            migrationBuilder.DropTable(
                name: "Topic");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "CourseLevel");

            migrationBuilder.DropTable(
                name: "CourseStatus");

            migrationBuilder.DropTable(
                name: "ApplicationStatus");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "CategoryStatus");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
