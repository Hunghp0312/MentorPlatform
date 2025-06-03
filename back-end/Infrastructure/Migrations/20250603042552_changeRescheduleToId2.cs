using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changeRescheduleToId2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SessionBookingStatus",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.InsertData(
                table: "SessionBookingStatus",
                columns: new[] { "Id", "Name" },
                values: new object[] { 2, "Rescheduled" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SessionBookingStatus",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.InsertData(
                table: "SessionBookingStatus",
                columns: new[] { "Id", "Name" },
                values: new object[] { 7, "Rescheduled" });
        }
    }
}
