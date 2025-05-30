using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCommunicationRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserCommunicationMethod");

            migrationBuilder.AddColumn<int>(
                name: "CommunicationMethodId",
                table: "UserProfile",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "SessionBookingStatus",
                columns: new[] { "Id", "Name" },
                values: new object[] { 6, "Scheduled" });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("03ea823d-d625-448d-901d-411c5028b769"),
                columns: new[] { "CommunicationMethodId", "UserGoal" },
                values: new object[] { 0, "To teach a seasoned software engineer and lead young developers." });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("0dd85da0-9214-419e-aa02-adefac68c264"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("148b5a81-90d6-476d-9fee-747b834011ee"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("862b702e-2c59-46f7-8c06-5349d769e237"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                column: "CommunicationMethodId",
                value: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_CommunicationMethodId",
                table: "UserProfile",
                column: "CommunicationMethodId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfile_CommunicationMethod_CommunicationMethodId",
                table: "UserProfile",
                column: "CommunicationMethodId",
                principalTable: "CommunicationMethod",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfile_CommunicationMethod_CommunicationMethodId",
                table: "UserProfile");

            migrationBuilder.DropIndex(
                name: "IX_UserProfile_CommunicationMethodId",
                table: "UserProfile");

            migrationBuilder.DeleteData(
                table: "SessionBookingStatus",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DropColumn(
                name: "CommunicationMethodId",
                table: "UserProfile");

            migrationBuilder.CreateTable(
                name: "UserCommunicationMethod",
                columns: table => new
                {
                    UserProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CommunicationMethodId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCommunicationMethod", x => new { x.UserProfileId, x.CommunicationMethodId });
                    table.ForeignKey(
                        name: "FK_UserCommunicationMethod_CommunicationMethod_CommunicationMethodId",
                        column: x => x.CommunicationMethodId,
                        principalTable: "CommunicationMethod",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserCommunicationMethod_UserProfile_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "UserProfile",
                keyColumn: "Id",
                keyValue: new Guid("03ea823d-d625-448d-901d-411c5028b769"),
                column: "UserGoal",
                value: "To teach a seasoned software engineer and lead younge developers.");

            migrationBuilder.CreateIndex(
                name: "IX_UserCommunicationMethod_CommunicationMethodId",
                table: "UserCommunicationMethod",
                column: "CommunicationMethodId");
        }
    }
}
