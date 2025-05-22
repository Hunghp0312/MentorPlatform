using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changeRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentContent_SupportingDocument_SupportingDocumentId",
                table: "DocumentContent");

            migrationBuilder.DropForeignKey(
                name: "FK_SupportingDocument_Resource_ResourceId",
                table: "SupportingDocument");

            migrationBuilder.DropIndex(
                name: "IX_SupportingDocument_ResourceId",
                table: "SupportingDocument");

            migrationBuilder.RenameColumn(
                name: "ResourceId",
                table: "SupportingDocument",
                newName: "DocumentContentId");

            migrationBuilder.RenameColumn(
                name: "SupportingDocumentId",
                table: "DocumentContent",
                newName: "Id");

            migrationBuilder.AddColumn<Guid>(
                name: "DocumentContentId",
                table: "Resource",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "DocumentContent",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "DocumentContent",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument",
                column: "DocumentContentId",
                unique: true,
                filter: "[DocumentContentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Resource_DocumentContentId",
                table: "Resource",
                column: "DocumentContentId",
                unique: true,
                filter: "[DocumentContentId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Resource_DocumentContent_DocumentContentId",
                table: "Resource",
                column: "DocumentContentId",
                principalTable: "DocumentContent",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupportingDocument_DocumentContent_DocumentContentId",
                table: "SupportingDocument",
                column: "DocumentContentId",
                principalTable: "DocumentContent",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resource_DocumentContent_DocumentContentId",
                table: "Resource");

            migrationBuilder.DropForeignKey(
                name: "FK_SupportingDocument_DocumentContent_DocumentContentId",
                table: "SupportingDocument");

            migrationBuilder.DropIndex(
                name: "IX_SupportingDocument_DocumentContentId",
                table: "SupportingDocument");

            migrationBuilder.DropIndex(
                name: "IX_Resource_DocumentContentId",
                table: "Resource");

            migrationBuilder.DropColumn(
                name: "DocumentContentId",
                table: "Resource");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "DocumentContent");

            migrationBuilder.DropColumn(
                name: "FileType",
                table: "DocumentContent");

            migrationBuilder.RenameColumn(
                name: "DocumentContentId",
                table: "SupportingDocument",
                newName: "ResourceId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DocumentContent",
                newName: "SupportingDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportingDocument_ResourceId",
                table: "SupportingDocument",
                column: "ResourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentContent_SupportingDocument_SupportingDocumentId",
                table: "DocumentContent",
                column: "SupportingDocumentId",
                principalTable: "SupportingDocument",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupportingDocument_Resource_ResourceId",
                table: "SupportingDocument",
                column: "ResourceId",
                principalTable: "Resource",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
