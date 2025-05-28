using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSeedDataWithConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAreaOfExpertise_UserProfile_UserProfileId",
                table: "UserAreaOfExpertise");

            migrationBuilder.DropIndex(
                name: "IX_UserAreaOfExpertise_UserProfileId",
                table: "UserAreaOfExpertise");

            migrationBuilder.DropColumn(
                name: "UserProfileId",
                table: "UserAreaOfExpertise");

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 27, 14, 20, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("03ea823d-d625-448d-901d-411c5028b769"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 28, 9, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("0dd85da0-9214-419e-aa02-adefac68c264"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 28, 14, 45, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("148b5a81-90d6-476d-9fee-747b834011ee"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 25, 10, 30, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 26, 11, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("862b702e-2c59-46f7-8c06-5349d769e237"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 26, 12, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 27, 11, 20, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 20, 9, 5, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 21, 16, 30, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                column: "LastLogin",
                value: new DateTime(2024, 5, 19, 17, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserProfileId",
                table: "UserAreaOfExpertise",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("03ea823d-d625-448d-901d-411c5028b769"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("0dd85da0-9214-419e-aa02-adefac68c264"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("148b5a81-90d6-476d-9fee-747b834011ee"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("862b702e-2c59-46f7-8c06-5349d769e237"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                column: "LastLogin",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 1, new Guid("03ea823d-d625-448d-901d-411c5028b769") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 7, new Guid("03ea823d-d625-448d-901d-411c5028b769") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 2, new Guid("0dd85da0-9214-419e-aa02-adefac68c264") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 3, new Guid("862b702e-2c59-46f7-8c06-5349d769e237") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 6, new Guid("862b702e-2c59-46f7-8c06-5349d769e237") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 2, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 8, new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 2, new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 5, new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 3, new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 4, new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserAreaOfExpertise",
                keyColumns: new[] { "AreaOfExpertiseId", "UserId" },
                keyValues: new object[] { 5, new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10") },
                column: "UserProfileId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_UserAreaOfExpertise_UserProfileId",
                table: "UserAreaOfExpertise",
                column: "UserProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAreaOfExpertise_UserProfile_UserProfileId",
                table: "UserAreaOfExpertise",
                column: "UserProfileId",
                principalTable: "UserProfile",
                principalColumn: "Id");
        }
    }
}
