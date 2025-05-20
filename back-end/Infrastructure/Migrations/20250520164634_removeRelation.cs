using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class removeRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserArenaOfExpertise_User_UserId",
                table: "UserArenaOfExpertise");

            migrationBuilder.DropIndex(
                name: "IX_UserArenaOfExpertise_UserId",
                table: "UserArenaOfExpertise");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserArenaOfExpertise");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "UserArenaOfExpertise",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserArenaOfExpertise_UserId",
                table: "UserArenaOfExpertise",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserArenaOfExpertise_User_UserId",
                table: "UserArenaOfExpertise",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");
        }
    }
}
