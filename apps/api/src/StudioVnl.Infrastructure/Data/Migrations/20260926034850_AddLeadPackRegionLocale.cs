using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioVnl.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadPackRegionLocale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "Leads",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "fr");

            migrationBuilder.AddColumn<string>(
                name: "Pack",
                table: "Leads",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Leads",
                type: "character varying(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Locale",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Pack",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Leads");
        }
    }
}
