namespace StudioVnl.Application.Abstractions;

/// <summary>Aides sur les clés de stockage des médias.</summary>
public static class MediaKeys
{
    /// <summary>
    /// Vrai si la clé est déjà une URL publique : URL absolue (extrait de
    /// banque vidéo posé par le seed en attendant les vraies vidéos) ou chemin
    /// racine servi par le front (`/placeholders/...`). Ces clés ne passent pas
    /// par le stockage : elles sont renvoyées telles quelles.
    /// </summary>
    public static bool IsAlreadyPublic(string key) =>
        key.StartsWith('/')
        || key.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
        || key.StartsWith("http://", StringComparison.OrdinalIgnoreCase);
}
