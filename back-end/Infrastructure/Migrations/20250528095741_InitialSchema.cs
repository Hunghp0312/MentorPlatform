using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserProfileId",
                table: "UserAreaOfExpertise",
                type: "uniqueidentifier",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
