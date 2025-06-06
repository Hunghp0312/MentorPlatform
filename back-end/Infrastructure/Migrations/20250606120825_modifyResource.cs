using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class modifyResource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resource_SupportingDocument_SupportingDocumentId",
                table: "Resource");

            migrationBuilder.DropIndex(
                name: "IX_Resource_SupportingDocumentId",
                table: "Resource");

            migrationBuilder.DropColumn(
                name: "SupportingDocumentId",
                table: "Resource");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Resource",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_ResourceId",
                table: "SupportingDocument",
                column: "ResourceId",
                unique: true,
                filter: "[ResourceId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_SupportingDocument_Resource_ResourceId",
                table: "SupportingDocument",
                column: "ResourceId",
                principalTable: "Resource",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SupportingDocument_Resource_ResourceId",
                table: "SupportingDocument");

            migrationBuilder.DropIndex(
                name: "IX_SupportingDocument_ResourceId",
                table: "SupportingDocument");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Resource");

            migrationBuilder.AddColumn<Guid>(
                name: "SupportingDocumentId",
                table: "Resource",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Resource_SupportingDocumentId",
                table: "Resource",
                column: "SupportingDocumentId",
                unique: true,
                filter: "[SupportingDocumentId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Resource_SupportingDocument_SupportingDocumentId",
                table: "Resource",
                column: "SupportingDocumentId",
                principalTable: "SupportingDocument",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
