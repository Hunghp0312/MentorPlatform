using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class dbUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeOnly>(
                name: "WorkdayEndTime",
                table: "UserProfile",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "WorkdayStartTime",
                table: "UserProfile",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "SessionBooking",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SessionBooking",
                keyColumn: "Id",
                keyValue: new Guid("305d81fd-ad60-4a28-8262-dea62b7aa589"),
                column: "CancelReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "SessionBooking",
                keyColumn: "Id",
                keyValue: new Guid("4c4b3461-068e-4a42-8ba0-647fe1ad5a9d"),
                column: "CancelReason",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("03ea823d-d625-448d-901d-411c5028b769"),
                columns: new[] { "UserGoal", "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { "To teach a seasoned software engineer and lead younge developers.", null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("0dd85da0-9214-419e-aa02-adefac68c264"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("148b5a81-90d6-476d-9fee-747b834011ee"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("862b702e-2c59-46f7-8c06-5349d769e237"),
                columns: new[] { "UserGoal", "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { "To share knowledge and expertise in frontend development and UI/UX design.", null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                columns: new[] { "UserGoal", "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { "To share knowledge and expertise in data science and machine learning.", null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                columns: new[] { "WorkdayEndTime", "WorkdayStartTime" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkdayEndTime",
                table: "UserProfile");

            migrationBuilder.DropColumn(
                name: "WorkdayStartTime",
                table: "UserProfile");

            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "SessionBooking");

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("03ea823d-d625-448d-901d-411c5028b769"),
                column: "UserGoal",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("862b702e-2c59-46f7-8c06-5349d769e237"),
                column: "UserGoal",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                column: "UserGoal",
                value: null);
        }
    }
}
