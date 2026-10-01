namespace StudioVnl.Application;

/// <summary>
/// Langues du site public. Une seule définition pour l'API (endpoints
/// publics, admin, sitemap, seed) : avant l'ajout de l'anglais, chaque
/// fichier portait sa propre copie de « nl sinon fr », et en oublier une
/// aurait silencieusement servi du français sur /en.
/// </summary>
public static class Locales
{
    public const string French = "fr";
    public const string Dutch = "nl";
    public const string English = "en";

    /// <summary>Toutes les langues, dans l'ordre du sélecteur du site.</summary>
    public static readonly string[] All = [French, Dutch, English];

    /// <summary>Langues supportées ; toute autre valeur retombe sur "fr".</summary>
    public static string Normalize(string? locale) =>
        locale is Dutch or English ? locale : French;
}
