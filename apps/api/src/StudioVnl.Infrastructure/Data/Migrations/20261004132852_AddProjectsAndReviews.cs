using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioVnl.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectsAndReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    CategoryKey = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    RegionId = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Venue = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    City = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    CountryCode = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false, defaultValue: "BE"),
                    Date = table.Column<DateOnly>(type: "date", nullable: true),
                    TitleFr = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    TitleNl = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    SummaryFr = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    SummaryNl = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    SummaryEn = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    BodyFr = table.Column<string>(type: "text", nullable: false),
                    BodyNl = table.Column<string>(type: "text", nullable: false),
                    BodyEn = table.Column<string>(type: "text", nullable: false),
                    Pack = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CoverMediaId = table.Column<Guid>(type: "uuid", nullable: true),
                    VideoMediaId = table.Column<Guid>(type: "uuid", nullable: true),
                    GalleryJson = table.Column<string>(type: "text", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_MediaAssets_CoverMediaId",
                        column: x => x.CoverMediaId,
                        principalTable: "MediaAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Projects_MediaAssets_VideoMediaId",
                        column: x => x.VideoMediaId,
                        principalTable: "MediaAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Author = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    City = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    CategoryKey = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Locale = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false, defaultValue: "fr"),
                    Quote = table.Column<string>(type: "character varying(1200)", maxLength: 1200, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: true),
                    Source = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CoverMediaId",
                table: "Projects",
                column: "CoverMediaId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Slug",
                table: "Projects",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Status_SortOrder",
                table: "Projects",
                columns: new[] { "Status", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_VideoMediaId",
                table: "Projects",
                column: "VideoMediaId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProjectId",
                table: "Reviews",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
