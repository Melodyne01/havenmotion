using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioVnl.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaAltText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AltEn",
                table: "MediaAssets",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AltFr",
                table: "MediaAssets",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AltNl",
                table: "MediaAssets",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AltEn",
                table: "MediaAssets");

            migrationBuilder.DropColumn(
                name: "AltFr",
                table: "MediaAssets");

            migrationBuilder.DropColumn(
                name: "AltNl",
                table: "MediaAssets");
        }
    }
}
