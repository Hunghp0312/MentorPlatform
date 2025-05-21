using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class modifyData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MentorApplication_User_ApplicantUserId",
                table: "MentorApplication");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "UserProfile");

            migrationBuilder.RenameColumn(
                name: "ApplicantUserId",
                table: "MentorApplication",
                newName: "ApplicantId");

            migrationBuilder.RenameIndex(
                name: "IX_MentorApplication_ApplicantUserId",
                table: "MentorApplication",
                newName: "IX_MentorApplication_ApplicantId");

            migrationBuilder.AddColumn<byte[]>(
                name: "PhotoData",
                table: "UserProfile",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MentorApplication_User_ApplicantId",
                table: "MentorApplication",
                column: "ApplicantId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MentorApplication_User_ApplicantId",
                table: "MentorApplication");

            migrationBuilder.DropColumn(
                name: "PhotoData",
                table: "UserProfile");

            migrationBuilder.RenameColumn(
                name: "ApplicantId",
                table: "MentorApplication",
                newName: "ApplicantUserId");

            migrationBuilder.RenameIndex(
                name: "IX_MentorApplication_ApplicantId",
                table: "MentorApplication",
                newName: "IX_MentorApplication_ApplicantUserId");

            migrationBuilder.AddColumn<byte[]>(
                name: "PhotoUrl",
                table: "UserProfile",
                type: "varbinary(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MentorApplication_User_ApplicantUserId",
                table: "MentorApplication",
                column: "ApplicantUserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
