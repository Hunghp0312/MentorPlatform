using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class relationwithmentorandadmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication",
                column: "AdminReviewerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication",
                column: "AdminReviewerId",
                unique: true,
                filter: "[AdminReviewerId] IS NOT NULL");
        }
    }
}
