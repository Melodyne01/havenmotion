using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioVnl.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLocaleSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Categories_Slug",
                table: "Categories");

            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "Testimonials",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "fr");

            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "SiteSettings",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "fr");

            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "Services",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "fr");

            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "ProcessSteps",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "fr");

            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "Categories",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "fr");

            migrationBuilder.CreateIndex(
                name: "IX_SiteSettings_Locale",
                table: "SiteSettings",
                column: "Locale",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug_Locale",
                table: "Categories",
                columns: new[] { "Slug", "Locale" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SiteSettings_Locale",
                table: "SiteSettings");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Slug_Locale",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Locale",
                table: "Testimonials");

            migrationBuilder.DropColumn(
                name: "Locale",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "Locale",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Locale",
                table: "ProcessSteps");

            migrationBuilder.DropColumn(
                name: "Locale",
                table: "Categories");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);
        }
    }
}
