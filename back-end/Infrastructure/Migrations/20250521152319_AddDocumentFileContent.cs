using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentFileContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileContent",
                table: "SupportingDocument");

            migrationBuilder.CreateTable(
                name: "DocumentContent",
                columns: table => new
                {
                    SupportingDocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentContent", x => x.SupportingDocumentId);
                    table.ForeignKey(
                        name: "FK_DocumentContent_SupportingDocument_SupportingDocumentId",
                        column: x => x.SupportingDocumentId,
                        principalTable: "SupportingDocument",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentContent");

            migrationBuilder.AddColumn<byte[]>(
                name: "FileContent",
                table: "SupportingDocument",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
