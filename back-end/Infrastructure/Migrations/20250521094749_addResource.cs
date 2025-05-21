using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addResource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "MentorApplicationId",
                table: "SupportingDocument",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "ResourceId",
                table: "SupportingDocument",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Resource",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: true),
                    ResourceCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resource", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Resource_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id");
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

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_ResourceId",
                table: "SupportingDocument",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Resource_CourseId",
                table: "Resource",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_SupportingDocument_Resource_ResourceId",
                table: "SupportingDocument",
                column: "ResourceId",
                principalTable: "Resource",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SupportingDocument_Resource_ResourceId",
                table: "SupportingDocument");

            migrationBuilder.DropTable(
                name: "Resource");

            migrationBuilder.DropIndex(
                name: "IX_SupportingDocument_ResourceId",
                table: "SupportingDocument");

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c1"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c2"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c3"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c4"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c5"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c6"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c7"));

            migrationBuilder.DeleteData(
                table: "ArenaOfExpertise",
                keyColumn: "Id",
                keyValue: new Guid("e0a0b0c0-d0e0-f0a0-b0c0-d0e0f0a0b0c8"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d1"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d2"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d3"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d4"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d5"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d6"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d7"));

            migrationBuilder.DeleteData(
                table: "Topic",
                keyColumn: "Id",
                keyValue: new Guid("f0b1c2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d8"));

            migrationBuilder.DropColumn(
                name: "ResourceId",
                table: "SupportingDocument");

            migrationBuilder.AlterColumn<Guid>(
                name: "MentorApplicationId",
                table: "SupportingDocument",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
