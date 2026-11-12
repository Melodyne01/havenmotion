using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioVnl.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryTranslationKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TranslationKey",
                table: "Categories",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_TranslationKey",
                table: "Categories",
                column: "TranslationKey");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Categories_TranslationKey",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "TranslationKey",
                table: "Categories");
        }
    }
}
