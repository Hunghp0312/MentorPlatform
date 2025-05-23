using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class requiredProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument");

            migrationBuilder.AlterColumn<Guid>(
                name: "DocumentContentId",
                table: "SupportingDocument",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument",
                column: "DocumentContentId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument");

            migrationBuilder.AlterColumn<Guid>(
                name: "DocumentContentId",
                table: "SupportingDocument",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument",
                column: "DocumentContentId",
                unique: true,
                filter: "[DocumentContentId] IS NOT NULL");
        }
    }
}
