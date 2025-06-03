using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class seedStatusData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SessionAvailabilityStatus",
                columns: new[] { "Id", "Name" },
                values: new object[] { 3, "Rescheduled" });

            migrationBuilder.InsertData(
                table: "SessionBookingStatus",
                columns: new[] { "Id", "Name" },
                values: new object[] { 7, "Rescheduled" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SessionAvailabilityStatus",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "SessionBookingStatus",
                keyColumn: "Id",
                keyValue: 7);
        }
    }
}
