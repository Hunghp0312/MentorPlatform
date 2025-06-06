using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changeToSetNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resource_DocumentContent_DocumentContentId",
                table: "Resource");

            migrationBuilder.AddForeignKey(
                name: "FK_Resource_DocumentContent_DocumentContentId",
                table: "Resource",
                column: "DocumentContentId",
                principalTable: "DocumentContent",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resource_DocumentContent_DocumentContentId",
                table: "Resource");

            migrationBuilder.AddForeignKey(
                name: "FK_Resource_DocumentContent_DocumentContentId",
                table: "Resource",
                column: "DocumentContentId",
                principalTable: "DocumentContent",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
