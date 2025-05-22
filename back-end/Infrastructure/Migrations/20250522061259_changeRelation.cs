using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changeRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MentorCertification_MentorApplication_MentorApplicationId",
                table: "MentorCertification");

            migrationBuilder.DropForeignKey(
                name: "FK_MentorEducation_MentorApplication_MentorApplicationId",
                table: "MentorEducation");

            migrationBuilder.DropForeignKey(
                name: "FK_MentorWorkExperience_MentorApplication_MentorApplicationId",
                table: "MentorWorkExperience");

            migrationBuilder.DropForeignKey(
                name: "FK_SupportingDocument_MentorApplication_MentorApplicationId",
                table: "SupportingDocument");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MentorApplication",
                table: "MentorApplication");

            migrationBuilder.DropIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication");

            migrationBuilder.DropIndex(
                name: "IX_MentorApplication_ApplicantId",
                table: "MentorApplication");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "MentorApplication");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MentorApplication",
                table: "MentorApplication",
                column: "ApplicantId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication",
                column: "AdminReviewerId",
                unique: true,
                filter: "[AdminReviewerId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_MentorCertification_MentorApplication_MentorApplicationId",
                table: "MentorCertification",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "ApplicantId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MentorEducation_MentorApplication_MentorApplicationId",
                table: "MentorEducation",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "ApplicantId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MentorWorkExperience_MentorApplication_MentorApplicationId",
                table: "MentorWorkExperience",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "ApplicantId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupportingDocument_MentorApplication_MentorApplicationId",
                table: "SupportingDocument",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "ApplicantId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MentorCertification_MentorApplication_MentorApplicationId",
                table: "MentorCertification");

            migrationBuilder.DropForeignKey(
                name: "FK_MentorEducation_MentorApplication_MentorApplicationId",
                table: "MentorEducation");

            migrationBuilder.DropForeignKey(
                name: "FK_MentorWorkExperience_MentorApplication_MentorApplicationId",
                table: "MentorWorkExperience");

            migrationBuilder.DropForeignKey(
                name: "FK_SupportingDocument_MentorApplication_MentorApplicationId",
                table: "SupportingDocument");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MentorApplication",
                table: "MentorApplication");

            migrationBuilder.DropIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "MentorApplication",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_MentorApplication",
                table: "MentorApplication",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_AdminReviewerId",
                table: "MentorApplication",
                column: "AdminReviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorApplication_ApplicantId",
                table: "MentorApplication",
                column: "ApplicantId");

            migrationBuilder.AddForeignKey(
                name: "FK_MentorCertification_MentorApplication_MentorApplicationId",
                table: "MentorCertification",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MentorEducation_MentorApplication_MentorApplicationId",
                table: "MentorEducation",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MentorWorkExperience_MentorApplication_MentorApplicationId",
                table: "MentorWorkExperience",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupportingDocument_MentorApplication_MentorApplicationId",
                table: "SupportingDocument",
                column: "MentorApplicationId",
                principalTable: "MentorApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
