using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioVnl.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// Ajoute la 6e catégorie "Événementiel" / "Evenementen" demandée par le
    /// client, et réordonne les 6 catégories dans l'ordre qu'il a fixé :
    /// événementiel, mariage, corporate, sport, clip, lifestyle.
    ///
    /// Migration de données (pas de changement de schéma) : les cinq
    /// catégories FR/NL existantes en prod ont déjà de vrais films, donc pas
    /// question de repasser par `SeedData` (qui ne s'exécute que sur une base
    /// vide). `DefaultCategories()` a été mis à jour en parallèle pour qu'une
    /// toute nouvelle installation parte directement avec les 6 dans le bon
    /// ordre — cette migration ne fait donc rien sur une base neuve (elle ne
    /// trouverait ni "mariage" à décaler, ni besoin d'insérer "evenementiel"
    /// une deuxième fois) et ne patch que les bases qui avaient déjà les 5
    /// catégories d'origine avant ce changement.
    ///
    /// Les décalages de SortOrder se font du bas vers le haut (6 avant 5, 5
    /// avant 4, ...) pour ne jamais faire cohabiter deux lignes sur le même
    /// rang, même un instant.
    ///
    /// Pas de tarif ni de durée ajoutés : le client les communiquera plus
    /// tard, la catégorie reste donc sans fiche de prestation (`Service`)
    /// tant qu'ils ne sont pas connus, plutôt que d'inventer un chiffre.
    /// </summary>
    public partial class SeedEvenementielCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // FR : décale mariage/corporate/sport/clip/lifestyle de 1..5 vers 2..6,
            // du rang le plus haut vers le plus bas. No-op sur une base neuve
            // (déjà seedée à 2..6 par `DefaultCategories()`) ou vide.
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 6 WHERE \"Slug\" = 'lifestyle' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 5 WHERE \"Slug\" = 'clip' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 4 WHERE \"Slug\" = 'sport' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 3 WHERE \"Slug\" = 'corporate' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 2 WHERE \"Slug\" = 'mariage' AND \"Locale\" = 'fr';");

            // NL : même décalage, slugs traduits.
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 6 WHERE \"Slug\" = 'lifestyle' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 5 WHERE \"Slug\" = 'clip' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 4 WHERE \"Slug\" = 'sport' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 3 WHERE \"Slug\" = 'zakelijk' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 2 WHERE \"Slug\" = 'huwelijk' AND \"Locale\" = 'nl';");

            // Nouvelle catégorie, rang 1, sans média ni fiche tarifaire : le
            // studio n'a ni tournage ni prix à présenter pour l'instant.
            // `WHERE NOT EXISTS` : ne s'insère pas en double si `SeedData` a
            // déjà créé la ligne (base neuve ou migration rejouée).
            migrationBuilder.Sql(
                """
                INSERT INTO "Categories" ("Id", "Slug", "Name", "Tagline", "Locale", "SortOrder", "FilmCountOverride", "ReelMediaId", "PosterMediaId", "IsPublished", "IsProtected")
                SELECT gen_random_uuid(), 'evenementiel', 'Événementiel', 'Soirées, anniversaires et événements privés, capturés dans l''instant et sans mise en scène.', 'fr', 1, NULL, NULL, NULL, TRUE, TRUE
                WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'evenementiel' AND "Locale" = 'fr');
                """);

            migrationBuilder.Sql(
                """
                INSERT INTO "Categories" ("Id", "Slug", "Name", "Tagline", "Locale", "SortOrder", "FilmCountOverride", "ReelMediaId", "PosterMediaId", "IsPublished", "IsProtected")
                SELECT gen_random_uuid(), 'evenementen', 'Evenementen', 'Feestjes, verjaardagen en privé-evenementen, vastgelegd in het moment en zonder regie.', 'nl', 1, NULL, NULL, NULL, TRUE, TRUE
                WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'evenementen' AND "Locale" = 'nl');
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM \"Categories\" WHERE \"Slug\" = 'evenementiel' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql("DELETE FROM \"Categories\" WHERE \"Slug\" = 'evenementen' AND \"Locale\" = 'nl';");

            // Restaure l'ordre d'origine, du rang le plus bas vers le plus haut.
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 1 WHERE \"Slug\" = 'mariage' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 1 WHERE \"Slug\" = 'huwelijk' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 2 WHERE \"Slug\" = 'corporate' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 2 WHERE \"Slug\" = 'zakelijk' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 3 WHERE \"Slug\" = 'sport' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 3 WHERE \"Slug\" = 'sport' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 4 WHERE \"Slug\" = 'clip' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 4 WHERE \"Slug\" = 'clip' AND \"Locale\" = 'nl';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 5 WHERE \"Slug\" = 'lifestyle' AND \"Locale\" = 'fr';");
            migrationBuilder.Sql(
                "UPDATE \"Categories\" SET \"SortOrder\" = 5 WHERE \"Slug\" = 'lifestyle' AND \"Locale\" = 'nl';");
        }
    }
}
