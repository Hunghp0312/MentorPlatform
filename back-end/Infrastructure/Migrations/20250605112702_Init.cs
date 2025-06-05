using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
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
                name: "AreaOfExpertise",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AreaOfExpertise", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Availability",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Availability", x => x.Id);
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
                name: "CommunicationMethod",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunicationMethod", x => x.Id);
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
                name: "LearningStyle",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearningStyle", x => x.Id);
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
                name: "SessionAvailabilityStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionAvailabilityStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SessionBookingStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionBookingStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SessionDuration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionDuration", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SessionFrequency",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionFrequency", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SessionType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeachingApproach",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeachingApproach", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Topic",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topic", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStatus", x => x.Id);
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
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    table.ForeignKey(
                        name: "FK_User_UserStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "UserStatus",
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
                    table.ForeignKey(
                        name: "FK_Course_User_MentorId",
                        column: x => x.MentorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MentorApplication",
                columns: table => new
                {
                    ApplicantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationStatusId = table.Column<int>(type: "int", nullable: false),
                    SubmissionDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastStatusUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdminReviewerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AdminComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RequestInfoDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorApplication", x => x.ApplicantId);
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
                name: "MentorDayAvailable",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Day = table.Column<DateOnly>(type: "date", nullable: false),
                    StartWorkTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndWorkTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    SessionDuration = table.Column<TimeOnly>(type: "time", nullable: false),
                    BufferTime = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorDayAvailable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorDayAvailable_User_MentorId",
                        column: x => x.MentorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserAreaOfExpertise",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AreaOfExpertiseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAreaOfExpertise", x => new { x.UserId, x.AreaOfExpertiseId });
                    table.ForeignKey(
                        name: "FK_UserAreaOfExpertise_AreaOfExpertise_AreaOfExpertiseId",
                        column: x => x.AreaOfExpertiseId,
                        principalTable: "AreaOfExpertise",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAreaOfExpertise_User_UserId",
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
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalSkill = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IndustryExperience = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    UserGoal = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SessionFrequencyId = table.Column<int>(type: "int", nullable: true),
                    SessionDurationId = table.Column<int>(type: "int", nullable: true),
                    PrivacyProfile = table.Column<bool>(type: "bit", nullable: true),
                    MessagePermission = table.Column<bool>(type: "bit", nullable: true),
                    NotificationsEnabled = table.Column<bool>(type: "bit", nullable: true),
                    CommunicationMethodId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfile_CommunicationMethod_CommunicationMethodId",
                        column: x => x.CommunicationMethodId,
                        principalTable: "CommunicationMethod",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfile_SessionDuration_SessionDurationId",
                        column: x => x.SessionDurationId,
                        principalTable: "SessionDuration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserProfile_SessionFrequency_SessionFrequencyId",
                        column: x => x.SessionFrequencyId,
                        principalTable: "SessionFrequency",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserProfile_User_Id",
                        column: x => x.Id,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LearnerCourse",
                columns: table => new
                {
                    LearnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearnerCourse", x => new { x.LearnerId, x.CourseId });
                    table.ForeignKey(
                        name: "FK_LearnerCourse_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LearnerCourse_User_LearnerId",
                        column: x => x.LearnerId,
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
                    CertificationName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    IssuingOrganization = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorCertification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorCertification_MentorApplication_MentorApplicationId",
                        column: x => x.MentorApplicationId,
                        principalTable: "MentorApplication",
                        principalColumn: "ApplicantId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentorEducation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstitutionName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FieldOfStudy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GraduationYear = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorEducation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorEducation_MentorApplication_MentorApplicationId",
                        column: x => x.MentorApplicationId,
                        principalTable: "MentorApplication",
                        principalColumn: "ApplicantId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentorWorkExperience",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Position = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
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
                        principalColumn: "ApplicantId",
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
                    DocumentContentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
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
                        principalColumn: "ApplicantId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MentorTimeAvailable",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Start = table.Column<TimeOnly>(type: "time", nullable: false),
                    End = table.Column<TimeOnly>(type: "time", nullable: false),
                    DayId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorTimeAvailable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentorTimeAvailable_MentorDayAvailable_DayId",
                        column: x => x.DayId,
                        principalTable: "MentorDayAvailable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MentorTimeAvailable_SessionAvailabilityStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "SessionAvailabilityStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MentorTeachingApproach",
                columns: table => new
                {
                    UserProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeachingApproachId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorTeachingApproach", x => new { x.UserProfileId, x.TeachingApproachId });
                    table.ForeignKey(
                        name: "FK_MentorTeachingApproach_TeachingApproach_TeachingApproachId",
                        column: x => x.TeachingApproachId,
                        principalTable: "TeachingApproach",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MentorTeachingApproach_UserProfile_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLearningStyle",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearningStyleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLearningStyle", x => new { x.UserId, x.LearningStyleId });
                    table.ForeignKey(
                        name: "FK_UserLearningStyle_LearningStyle_LearningStyleId",
                        column: x => x.LearningStyleId,
                        principalTable: "LearningStyle",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLearningStyle_UserProfile_UserId",
                        column: x => x.UserId,
                        principalTable: "UserProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileAvailability",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AvailabilityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileAvailability", x => new { x.UserId, x.AvailabilityId });
                    table.ForeignKey(
                        name: "FK_UserProfileAvailability_Availability_AvailabilityId",
                        column: x => x.AvailabilityId,
                        principalTable: "Availability",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfileAvailability_UserProfile_UserId",
                        column: x => x.UserId,
                        principalTable: "UserProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTopicOfInterest",
                columns: table => new
                {
                    UserProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TopicId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTopicOfInterest", x => new { x.UserProfileId, x.TopicId });
                    table.ForeignKey(
                        name: "FK_UserTopicOfInterest_Topic_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTopicOfInterest_UserProfile_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SessionBooking",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearnerMessage = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CancelReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LearnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorTimeAvailableId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    SessionTypeId = table.Column<int>(type: "int", nullable: false),
                    LastReminderSent = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionBooking", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionBooking_MentorTimeAvailable_MentorTimeAvailableId",
                        column: x => x.MentorTimeAvailableId,
                        principalTable: "MentorTimeAvailable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionBooking_SessionBookingStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "SessionBookingStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionBooking_SessionType_SessionTypeId",
                        column: x => x.SessionTypeId,
                        principalTable: "SessionType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionBooking_User_LearnerId",
                        column: x => x.LearnerId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionBooking_User_MentorId",
                        column: x => x.MentorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "ApplicationStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Pending" },
                    { 2, "Rejected" },
                    { 3, "Approved" },
                    { 4, "Request Info" },
                    { 5, "Submitted" },
                    { 6, "Under Review" }
                });

            migrationBuilder.InsertData(
                table: "AreaOfExpertise",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Leadership" },
                    { 2, "Programming" },
                    { 3, "Design" },
                    { 4, "Marketing" },
                    { 5, "Data Science" },
                    { 6, "Business" },
                    { 7, "Project Management" },
                    { 8, "Communication" }
                });

            migrationBuilder.InsertData(
                table: "Availability",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Weekdays" },
                    { 2, "Weekends" },
                    { 3, "Mornings" },
                    { 4, "Afternoons" },
                    { 5, "Evenings" }
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
                table: "CommunicationMethod",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Video Call" },
                    { 2, "Audio Call" },
                    { 3, "Text Chat" }
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
                table: "LearningStyle",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Visual" },
                    { 2, "Auditory" },
                    { 3, "Reading/Writing" },
                    { 4, "Kinesthetic" }
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
                table: "SessionAvailabilityStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Available" },
                    { 2, "Booked" },
                    { 3, "Rescheduled" }
                });

            migrationBuilder.InsertData(
                table: "SessionBookingStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Pending" },
                    { 2, "Rescheduled" },
                    { 3, "Declined" },
                    { 4, "Completed" },
                    { 5, "Cancelled" },
                    { 6, "Scheduled" }
                });

            migrationBuilder.InsertData(
                table: "SessionDuration",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "30 minutes" },
                    { 2, "45 minutes" },
                    { 3, "1 hour" },
                    { 4, "1.5 hours" },
                    { 5, "2 hours" }
                });

            migrationBuilder.InsertData(
                table: "SessionFrequency",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Weekly" },
                    { 2, "Every two weeks" },
                    { 3, "Monthly" },
                    { 4, "As needed" }
                });

            migrationBuilder.InsertData(
                table: "SessionType",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Virtual Session" },
                    { 2, "In-Person Session" },
                    { 3, "On-Site Session" }
                });

            migrationBuilder.InsertData(
                table: "TeachingApproach",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Hands-on Practice" },
                    { 2, "Project Based" },
                    { 3, "Disscussion Based" },
                    { 4, "Lecture Style" }
                });

            migrationBuilder.InsertData(
                table: "Topic",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Career Development" },
                    { 2, "Technical Skills" },
                    { 3, "Leadership" },
                    { 4, "Communication" },
                    { 5, "Work-Life Balance" },
                    { 6, "Industry Insights" },
                    { 7, "Networking" },
                    { 8, "Entrepreneurship" }
                });

            migrationBuilder.InsertData(
                table: "UserStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Active" },
                    { 2, "Pending" },
                    { 3, "Deactivated" }
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
                columns: new[] { "Id", "CreatedAt", "Email", "LastLogin", "PasswordHash", "PasswordResetExpiry", "PasswordResetToken", "RefreshToken", "RefreshTokenExpiryTime", "RoleId", "StatusId" },
                values: new object[,]
                {
                    { new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"), new DateTime(2024, 1, 17, 14, 20, 0, 0, DateTimeKind.Utc), "minhchau.admin@gmail.com", new DateTime(2024, 5, 27, 14, 20, 0, 0, DateTimeKind.Utc), "7ZpVU6DoVE+e0Op1dI8PIvL4VVOQimwEZdUZskBB0plT1CmAP/y+SRsT9WSZudW8", null, null, null, null, 1, 1 },
                    { new Guid("03ea823d-d625-448d-901d-411c5028b769"), new DateTime(2024, 3, 1, 10, 0, 0, 0, DateTimeKind.Utc), "huynguyen.mentor@gmail.com", new DateTime(2024, 5, 28, 9, 0, 0, 0, DateTimeKind.Utc), "ZKZIjsIEcJZT88GTD+nT3l+vwBZH/mla4b5WiSYufGWiOAbvBqnoRNZQjM6qsaqq", null, null, null, null, 3, 2 },
                    { new Guid("0dd85da0-9214-419e-aa02-adefac68c264"), new DateTime(2024, 3, 15, 14, 45, 0, 0, DateTimeKind.Utc), "dancega713@gmail.com", new DateTime(2024, 5, 28, 14, 45, 0, 0, DateTimeKind.Utc), "r0e+UhrOsii3FlfUcY8OKkdRK1bc5komYpbONiqqJYj6qD78uz9oc+1XH+3IiEZw", null, null, null, null, 2, 1 },
                    { new Guid("148b5a81-90d6-476d-9fee-747b834011ee"), new DateTime(2024, 1, 15, 10, 30, 0, 0, DateTimeKind.Utc), "huynguyen.admin@gmail.com", new DateTime(2024, 5, 25, 10, 30, 0, 0, DateTimeKind.Utc), "4CojI/ZvEQrJoJShTol0qRKe7e2405PVU3hFGnrjR0aDrWVa3D7eNC3WhLJkK26I", null, null, null, null, 1, 1 },
                    { new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"), new DateTime(2024, 1, 16, 11, 0, 0, 0, DateTimeKind.Utc), "huykhuong.admin@gmail.com", new DateTime(2024, 5, 26, 11, 0, 0, 0, DateTimeKind.Utc), "/+9ouySHkK9R7JdK3pa7U54juoLGcDiqYx2POg1X3bZLkBvw0FVDzkFMUD+Vmc+E", null, null, null, null, 1, 1 },
                    { new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), new DateTime(2024, 3, 10, 12, 0, 0, 0, DateTimeKind.Utc), "minhchau.mentor@gmail.com", new DateTime(2024, 5, 26, 12, 0, 0, 0, DateTimeKind.Utc), "dhkox+ORaHABdxUb6ihukuIpaSWTQOhgaObuiH3yr7E7WpX+vCJOH1PBlc5RbhQr", null, null, null, null, 3, 2 },
                    { new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), new DateTime(2024, 3, 5, 11, 20, 0, 0, DateTimeKind.Utc), "huykhuong.mentor@gmail.com", new DateTime(2024, 5, 27, 11, 20, 0, 0, DateTimeKind.Utc), "kj0QXVpwv8AjYwrfB+FPVaxCzfziTAXK32tqjdoPoc82UNhIxrkXB+2NSkaAr5AV", null, null, null, null, 3, 2 },
                    { new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"), new DateTime(2024, 2, 10, 9, 5, 0, 0, DateTimeKind.Utc), "huynguyen.learner@gmail.com", new DateTime(2024, 5, 20, 9, 5, 0, 0, DateTimeKind.Utc), "B/Rx/lR+MNs1oWANBFYVwZXSd2hFKDhpk0By7MEg7K3ecpz9LwQBZiUv07/TkqVu", null, null, null, null, 2, 1 },
                    { new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), new DateTime(2024, 2, 12, 16, 30, 0, 0, DateTimeKind.Utc), "huykhuong.learner@gmail.com", new DateTime(2024, 5, 21, 16, 30, 0, 0, DateTimeKind.Utc), "odpdHFLV8lFXrpiHJJtYd0npiynudyI824s0lciPT5yBap7SDcMWGHCmAXoPtRyi", null, null, null, null, 2, 1 },
                    { new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"), new DateTime(2024, 2, 18, 17, 0, 0, 0, DateTimeKind.Utc), "minhchau.learner@gmail.com", new DateTime(2024, 5, 19, 17, 0, 0, 0, DateTimeKind.Utc), "d9G9m3ndZwGLV5ciCqHMDRGslR0k1znhgJiPFvN33VyVNYSIeREzLj9Qgtk4m4TT", null, null, null, null, 2, 3 }
                });

            migrationBuilder.InsertData(
                table: "Course",
                columns: new[] { "Id", "CategoryId", "Created", "Description", "Duration", "LastUpdated", "LevelId", "MentorId", "Name", "StatusId", "Tags" },
                values: new object[,]
                {
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72840"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master version control with Git and GitHub.", "1 week", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "Git & GitHub Basics", 3, "Git,GitHub,version control,beginner" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72841"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Write unit tests and follow TDD in .NET.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "Unit Testing in .NET", 2, ".NET,testing,TDD,unit tests" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72842"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Learn how to build reactive UIs using React.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "React Essentials", 2, "React,JavaScript,frontend,UI" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72843"), new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Create beautiful static websites using HTML and CSS.", "2 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "HTML & CSS Basics", 1, "HTML,CSS,web design,frontend" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72844"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master Entity Framework Core for modern data access.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "EF Core Masterclass", 2, "EF Core,Entity Framework,data access,.NET" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72845"), new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Understand SQL basics and database querying.", "2 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "SQL for Beginners", 3, "SQL,database,queries,beginner" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72846"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Build and deploy RESTful APIs using ASP.NET Core.", "5 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "Advanced .NET APIs", 2, ".NET,ASP.NET Core,API,REST" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72847"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Master object-oriented programming concepts in C#.", "4 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "OOP in C#", 1, "C#,OOP,classes,inheritance" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72848"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Learn the fundamentals of C#.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "Intro to C#", 2, "C#,programming,fundamentals" },
                    { new Guid("8d02b327-6370-41c7-95bb-6a8d72b72849"), new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Containerize and deploy apps with Docker.", "3 weeks", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "Docker for Developers", 1, "Docker,containers,devops,deployment" }
                });

            migrationBuilder.InsertData(
                table: "MentorDayAvailable",
                columns: new[] { "Id", "BufferTime", "Day", "EndWorkTime", "MentorId", "SessionDuration", "StartWorkTime" },
                values: new object[,]
                {
                    { new Guid("1c7b9f0e-9c3a-4b8f-8e6a-1b9e7b1a3b0f"), new TimeOnly(0, 15, 0), new DateOnly(2025, 6, 7), new TimeOnly(12, 30, 0), new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), new TimeOnly(0, 45, 0), new TimeOnly(10, 0, 0) },
                    { new Guid("4a6e7525-23e4-4d6f-930b-22f2e40783d9"), new TimeOnly(0, 15, 0), new DateOnly(2025, 6, 3), new TimeOnly(17, 0, 0), new Guid("03ea823d-d625-448d-901d-411c5028b769"), new TimeOnly(1, 0, 0), new TimeOnly(14, 0, 0) },
                    { new Guid("9e8d7c6b-5a4b-3c2d-1e0f-a9b8c7d6e5f4"), new TimeOnly(0, 10, 0), new DateOnly(2025, 6, 8), new TimeOnly(11, 0, 0), new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), new TimeOnly(0, 30, 0), new TimeOnly(8, 30, 0) },
                    { new Guid("da331a4b-3665-4d78-99a6-825da4015e76"), new TimeOnly(0, 15, 0), new DateOnly(2025, 6, 2), new TimeOnly(12, 0, 0), new Guid("03ea823d-d625-448d-901d-411c5028b769"), new TimeOnly(1, 0, 0), new TimeOnly(9, 0, 0) },
                    { new Guid("e1a3f4b8-7c69-45a7-b0f5-92bffe86754b"), new TimeOnly(0, 5, 0), new DateOnly(2025, 6, 9), new TimeOnly(15, 30, 0), new Guid("03ea823d-d625-448d-901d-411c5028b769"), new TimeOnly(0, 30, 0), new TimeOnly(13, 0, 0) },
                    { new Guid("f4e2b81e-479a-4b6a-8a4d-08d3e4c8a6b0"), new TimeOnly(0, 15, 0), new DateOnly(2025, 6, 5), new TimeOnly(21, 0, 0), new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), new TimeOnly(1, 0, 0), new TimeOnly(19, 0, 0) }
                });

            migrationBuilder.InsertData(
                table: "UserAreaOfExpertise",
                columns: new[] { "AreaOfExpertiseId", "UserId" },
                values: new object[,]
                {
                    { 1, new Guid("03ea823d-d625-448d-901d-411c5028b769") },
                    { 7, new Guid("03ea823d-d625-448d-901d-411c5028b769") },
                    { 2, new Guid("0dd85da0-9214-419e-aa02-adefac68c264") },
                    { 3, new Guid("862b702e-2c59-46f7-8c06-5349d769e237") },
                    { 6, new Guid("862b702e-2c59-46f7-8c06-5349d769e237") },
                    { 2, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56") },
                    { 8, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56") },
                    { 2, new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812") },
                    { 5, new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812") },
                    { 3, new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16") },
                    { 4, new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16") },
                    { 5, new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10") }
                });

            migrationBuilder.InsertData(
                table: "UserProfile",
                columns: new[] { "Id", "Bio", "CommunicationMethodId", "FullName", "IndustryExperience", "MessagePermission", "NotificationsEnabled", "PhoneNumber", "PhotoData", "PrivacyProfile", "ProfessionalSkill", "SessionDurationId", "SessionFrequencyId", "UserGoal" },
                values: new object[,]
                {
                    { new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"), "Senior administrator overseeing platform development and technical operations.", 3, "Minh Chau Admin", "Experienced in project management, system architecture, and team leadership, with expertise in platform development and technical operations.", true, true, null, null, true, "Project management, System architecture, Team leadership", 3, 4, null },
                    { new Guid("03ea823d-d625-448d-901d-411c5028b769"), "Senior software engineer with 8+ years of experience in full-stack development.", 1, "Huy Nguyen Mentor", "Fintech, E-commerce, Enterprise applications", true, true, null, null, false, "Java, Spring, React, AWS, DevOps", 4, 2, "To teach a seasoned software engineer and lead young developers." },
                    { new Guid("0dd85da0-9214-419e-aa02-adefac68c264"), "Full-stack developer with interest in blockchain and distributed systems.", 1, "Dan Cega", "Full-stack developer with interest in blockchain and distributed systems, with expertise in blockchain, distributed systems, and problem-solving.", true, true, null, null, false, "Blockchain, Distributed systems, Problem-solving", 5, 1, "To build scalable decentralized applications and smart contracts." },
                    { new Guid("148b5a81-90d6-476d-9fee-747b834011ee"), "Experienced tech administrator with background in education platforms.", 1, "Huy Nguyen Admin", "Experienced in education platforms, with expertise in system administration, DevOps, and cloud infrastructure.", true, true, null, null, true, "System administration, DevOps, Cloud infrastructure", 3, 4, null },
                    { new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"), "Platform administrator with focus on user experience and system reliability.", 2, "Huy Khuong Admin", "Experienced in user experience and system reliability, with expertise in user management, technical support, and data analytics.", true, true, null, null, true, "User management, Technical support, Data analytics", 3, 4, null },
                    { new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), "Frontend specialist with expertise in modern JavaScript frameworks and UI/UX principles.", 3, "Minh Chau Mentor", "SaaS products, E-learning platforms, Creative agencies", true, false, null, null, false, "React, Vue.js, Angular, SCSS, Accessibility", 2, 4, "To share knowledge and expertise in frontend development and UI/UX design." },
                    { new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"), "Data scientist specializing in predictive analytics and natural language processing.", 2, "Huy Khuong Mentor", "Healthcare, Research, Marketing analytics", true, true, null, null, true, "Python, TensorFlow, PyTorch, NLP, Big Data", 3, 1, "To share knowledge and expertise in data science and machine learning." },
                    { new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"), "Aspiring software developer interested in web technologies and cloud computing.", 1, "Huy Nguyen Learner", "Aspiring software developer interested in web technologies and cloud computing, with expertise in web development, cloud computing, and problem-solving.", true, true, null, null, true, "Web development, Cloud computing, Problem-solving", 2, 1, "To master modern web development frameworks and secure a developer position." },
                    { new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), "Data science enthusiast with background in statistics and mathematics.", 2, "Huy Khuong Learner", "Data science enthusiast with background in statistics and mathematics, with expertise in machine learning algorithms and data visualization.", true, true, null, null, false, "Statistics, Mathematics, Machine learning", 3, 2, "To develop expertise in machine learning algorithms and data visualization." },
                    { new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"), "UX/UI designer looking to expand skills in frontend development.", 3, "Minh Chau Learner", "UX/UI designer looking to expand skills in frontend development, with expertise in UX/UI design, frontend development, and problem-solving.", false, false, null, null, true, "UX/UI design, Frontend development, Problem-solving", 1, 3, "To combine design expertise with technical implementation skills." }
                });

            migrationBuilder.InsertData(
                table: "MentorTimeAvailable",
                columns: new[] { "Id", "DayId", "End", "Start", "StatusId" },
                values: new object[,]
                {
                    { new Guid("10000000-0000-0000-0000-000000000001"), new Guid("da331a4b-3665-4d78-99a6-825da4015e76"), new TimeOnly(9, 30, 0), new TimeOnly(9, 0, 0), 1 },
                    { new Guid("10000000-0000-0000-0000-000000000002"), new Guid("da331a4b-3665-4d78-99a6-825da4015e76"), new TimeOnly(10, 0, 0), new TimeOnly(9, 30, 0), 1 },
                    { new Guid("10000000-0000-0000-0000-000000000003"), new Guid("4a6e7525-23e4-4d6f-930b-22f2e40783d9"), new TimeOnly(14, 30, 0), new TimeOnly(14, 0, 0), 1 },
                    { new Guid("10000000-0000-0000-0000-000000000004"), new Guid("4a6e7525-23e4-4d6f-930b-22f2e40783d9"), new TimeOnly(15, 0, 0), new TimeOnly(14, 30, 0), 1 },
                    { new Guid("10000000-0000-0000-0000-000000000005"), new Guid("f4e2b81e-479a-4b6a-8a4d-08d3e4c8a6b0"), new TimeOnly(10, 30, 0), new TimeOnly(10, 0, 0), 1 },
                    { new Guid("10000000-0000-0000-0000-000000000006"), new Guid("f4e2b81e-479a-4b6a-8a4d-08d3e4c8a6b0"), new TimeOnly(11, 0, 0), new TimeOnly(10, 30, 0), 1 }
                });

            migrationBuilder.InsertData(
                table: "SessionBooking",
                columns: new[] { "Id", "CancelReason", "CreatedAt", "LastReminderSent", "LearnerId", "LearnerMessage", "MentorId", "MentorTimeAvailableId", "SessionTypeId", "StatusId" },
                values: new object[,]
                {
                    { new Guid("305d81fd-ad60-4a28-8262-dea62b7aa589"), null, new DateTime(2025, 5, 29, 11, 0, 0, 0, DateTimeKind.Utc), null, new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), "Please help me review my CV for a junior developer position.", new Guid("03ea823d-d625-448d-901d-411c5028b769"), new Guid("10000000-0000-0000-0000-000000000002"), 3, 1 },
                    { new Guid("4c4b3461-068e-4a42-8ba0-647fe1ad5a9d"), null, new DateTime(2025, 5, 28, 10, 0, 0, 0, DateTimeKind.Utc), null, new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), "I would like to discuss about C# performance optimization.", new Guid("03ea823d-d625-448d-901d-411c5028b769"), new Guid("10000000-0000-0000-0000-000000000001"), 3, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AreaOfExpertise_Name",
                table: "AreaOfExpertise",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Availability_Name",
                table: "Availability",
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
                name: "IX_Course_MentorId",
                table: "Course",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_StatusId",
                table: "Course",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_LearnerCourse_CourseId",
                table: "LearnerCourse",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication",
                column: "AdminReviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_ApplicationStatusId",
                table: "MentorApplication",
                column: "ApplicationStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorCertification_MentorApplicationId",
                table: "MentorCertification",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorDayAvailable_MentorId",
                table: "MentorDayAvailable",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorEducation_MentorApplicationId",
                table: "MentorEducation",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorTeachingApproach_TeachingApproachId",
                table: "MentorTeachingApproach",
                column: "TeachingApproachId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorTimeAvailable_DayId",
                table: "MentorTimeAvailable",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorTimeAvailable_StatusId",
                table: "MentorTimeAvailable",
                column: "StatusId");

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
                name: "IX_SessionBooking_LearnerId",
                table: "SessionBooking",
                column: "LearnerId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionBooking_MentorId",
                table: "SessionBooking",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionBooking_MentorTimeAvailableId",
                table: "SessionBooking",
                column: "MentorTimeAvailableId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionBooking_SessionTypeId",
                table: "SessionBooking",
                column: "SessionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionBooking_StatusId",
                table: "SessionBooking",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument",
                column: "DocumentContentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_MentorApplicationId",
                table: "SupportingDocument",
                column: "MentorApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_TeachingApproach_Name",
                table: "TeachingApproach",
                column: "Name",
                unique: true);

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
                name: "IX_User_StatusId",
                table: "User",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAreaOfExpertise_AreaOfExpertiseId",
                table: "UserAreaOfExpertise",
                column: "AreaOfExpertiseId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLearningStyle_LearningStyleId",
                table: "UserLearningStyle",
                column: "LearningStyleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_CommunicationMethodId",
                table: "UserProfile",
                column: "CommunicationMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_SessionDurationId",
                table: "UserProfile",
                column: "SessionDurationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_SessionFrequencyId",
                table: "UserProfile",
                column: "SessionFrequencyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileAvailability_AvailabilityId",
                table: "UserProfileAvailability",
                column: "AvailabilityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTopicOfInterest_TopicId",
                table: "UserTopicOfInterest",
                column: "TopicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LearnerCourse");

            migrationBuilder.DropTable(
                name: "MentorCertification");

            migrationBuilder.DropTable(
                name: "MentorEducation");

            migrationBuilder.DropTable(
                name: "MentorTeachingApproach");

            migrationBuilder.DropTable(
                name: "MentorWorkExperience");

            migrationBuilder.DropTable(
                name: "Resource");

            migrationBuilder.DropTable(
                name: "SessionBooking");

            migrationBuilder.DropTable(
                name: "SupportingDocument");

            migrationBuilder.DropTable(
                name: "UserAreaOfExpertise");

            migrationBuilder.DropTable(
                name: "UserLearningStyle");

            migrationBuilder.DropTable(
                name: "UserProfileAvailability");

            migrationBuilder.DropTable(
                name: "UserTopicOfInterest");

            migrationBuilder.DropTable(
                name: "TeachingApproach");

            migrationBuilder.DropTable(
                name: "Course");

            migrationBuilder.DropTable(
                name: "MentorTimeAvailable");

            migrationBuilder.DropTable(
                name: "SessionBookingStatus");

            migrationBuilder.DropTable(
                name: "SessionType");

            migrationBuilder.DropTable(
                name: "DocumentContent");

            migrationBuilder.DropTable(
                name: "MentorApplication");

            migrationBuilder.DropTable(
                name: "AreaOfExpertise");

            migrationBuilder.DropTable(
                name: "LearningStyle");

            migrationBuilder.DropTable(
                name: "Availability");

            migrationBuilder.DropTable(
                name: "Topic");

            migrationBuilder.DropTable(
                name: "UserProfile");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "CourseLevel");

            migrationBuilder.DropTable(
                name: "CourseStatus");

            migrationBuilder.DropTable(
                name: "MentorDayAvailable");

            migrationBuilder.DropTable(
                name: "SessionAvailabilityStatus");

            migrationBuilder.DropTable(
                name: "ApplicationStatus");

            migrationBuilder.DropTable(
                name: "CommunicationMethod");

            migrationBuilder.DropTable(
                name: "SessionDuration");

            migrationBuilder.DropTable(
                name: "SessionFrequency");

            migrationBuilder.DropTable(
                name: "CategoryStatus");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "UserStatus");
        }
    }
}
