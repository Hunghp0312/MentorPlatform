using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class seedSessionBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SessionBooking",
                columns: new[] { "Id", "AvailabilitySlotId", "CreatedAt", "LearnerId", "LearnerMessage", "MentorId", "SessionTypeId", "StatusId" },
                values: new object[,]
                {
                    { new Guid("305d81fd-ad60-4a28-8262-dea62b7aa589"), new Guid("1c7b9f0e-9c3a-4b8f-8e6a-1b9e7b1a3b0f"), new DateTime(2025, 5, 29, 11, 0, 0, 0, DateTimeKind.Utc), new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), "Please help me review my CV for a junior developer position.", new Guid("862b702e-2c59-46f7-8c06-5349d769e237"), 3, 1 },
                    { new Guid("4c4b3461-068e-4a42-8ba0-647fe1ad5a9d"), new Guid("f4e2b81e-479a-4b6a-8a4d-08d3e4c8a6b0"), new DateTime(2025, 5, 28, 10, 0, 0, 0, DateTimeKind.Utc), new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), "I would like to discuss about C# performance optimization.", new Guid("03ea823d-d625-448d-901d-411c5028b769"), 3, 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SessionBooking",
                keyColumn: "Id",
                keyValue: new Guid("305d81fd-ad60-4a28-8262-dea62b7aa589"));

            migrationBuilder.DeleteData(
                table: "SessionBooking",
                keyColumn: "Id",
                keyValue: new Guid("4c4b3461-068e-4a42-8ba0-647fe1ad5a9d"));
        }
    }
}
