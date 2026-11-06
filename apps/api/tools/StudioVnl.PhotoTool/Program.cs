using System.Globalization;
using System.Text;
using StudioVnl.Imaging;

// Prépare les photos des galeries de prestation (`/prestations/<catégorie>`).
//
//   dotnet run --project apps/api/tools/StudioVnl.PhotoTool -- <catégorie> <dossier-source>
//
// Pour chaque photo du dossier (JPEG, PNG, WebP, TIFF), écrit
// `apps/web/public/photos/<catégorie>/<slug>-800.webp` et `-1600.webp` —
// redressées, sans EXIF ni GPS, mêmes réglages que les photos déposées dans le
// backoffice — puis affiche les entrées à coller dans
// `apps/web/src/app/core/category-photos.ts`. Le slug vient du nom du fichier :
// nommez vos fichiers comme ce qu'ils montrent (`premiere-danse-maries.jpg`),
// c'est aussi ce que lit Google Images.

string[] sourceExtensions = [".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"];
int[] widths = [800, 1600];

if (args.Length < 2 || args.Contains("--help") || args.Contains("-h"))
{
    Console.Error.WriteLine("""
        Usage : dotnet run --project apps/api/tools/StudioVnl.PhotoTool -- <catégorie> <dossier-source> [--out <dossier>] [--quality <1-100>]

          <catégorie>       clé de la catégorie (slug FR) : mariage, evenementiel, corporate, sport, clip, lifestyle
          <dossier-source>  dossier contenant les photos d'origine (JPEG, PNG, WebP, TIFF)
          --out             dossier racine des photos (défaut : apps/web/public/photos du dépôt)
          --quality         qualité WebP (défaut : 80)
        """);
    return args.Length < 2 ? 1 : 0;
}

var category = Slugify(args[0]);
var sourceDir = Path.GetFullPath(args[1]);
var outRoot = Option("--out") ?? FindPhotosRoot();
var quality = int.TryParse(Option("--quality"), out var q) && q is >= 1 and <= 100 ? q : WebImage.DefaultWebpQuality;

if (!Directory.Exists(sourceDir))
{
    Console.Error.WriteLine($"Dossier introuvable : {sourceDir}");
    return 1;
}
if (outRoot is null)
{
    Console.Error.WriteLine("Dossier apps/web/public/photos introuvable : lancez l'outil depuis le dépôt ou passez --out.");
    return 1;
}

var files = Directory.EnumerateFiles(sourceDir)
    .Where(f => sourceExtensions.Contains(Path.GetExtension(f).ToLowerInvariant()))
    .Order(StringComparer.OrdinalIgnoreCase)
    .ToList();
if (files.Count == 0)
{
    Console.Error.WriteLine($"Aucune photo (JPEG, PNG, WebP, TIFF) dans {sourceDir}");
    return 1;
}

var targetDir = Path.Combine(outRoot, category);
Directory.CreateDirectory(targetDir);

var entries = new StringBuilder();
var failures = 0;
long sourceBytes = 0, outputBytes = 0;
var seen = new HashSet<string>();

foreach (var file in files)
{
    var slug = Slugify(Path.GetFileNameWithoutExtension(file));
    if (!seen.Add(slug))
    {
        Console.Error.WriteLine($"  ! {Path.GetFileName(file)} : le slug « {slug} » est déjà pris par une autre photo, ignorée.");
        failures++;
        continue;
    }

    try
    {
        await using var source = File.OpenRead(file);
        using var image = await WebImage.LoadAsync(source, CancellationToken.None);
        sourceBytes += source.Length;

        var (largeWidth, largeHeight) = (0, 0);
        foreach (var width in widths)
        {
            var path = Path.Combine(targetDir, $"{slug}-{width}.webp");
            var size = await image.SaveAsync(path, width, WebImageFormat.Webp, CancellationToken.None, quality);
            outputBytes += new FileInfo(path).Length;
            if (width == widths[^1])
            {
                (largeWidth, largeHeight) = size;
            }
        }
        if (image.Width < widths[^1])
        {
            Console.Error.WriteLine($"  ! {Path.GetFileName(file)} : {image.Width} px de large seulement, la version -1600 n'est pas agrandie.");
        }

        Console.Error.WriteLine($"  ✓ {slug} ({largeWidth}×{largeHeight})");
        entries.Append($$"""
                {
                  slug: '{{slug}}',
                  width: {{largeWidth}},
                  height: {{largeHeight}},
                  alt: {
                    fr: 'TODO : décrire la photo en une phrase',
                    nl: 'TODO',
                    en: 'TODO',
                  },
                },

            """);
    }
    catch (WebImageException exception)
    {
        Console.Error.WriteLine($"  ✗ {Path.GetFileName(file)} : {exception.Message}");
        failures++;
    }
}

Console.Error.WriteLine();
Console.Error.WriteLine(
    $"{files.Count - failures} photo(s) écrite(s) dans {targetDir} — " +
    $"{sourceBytes / 1048576.0:0.0} Mo d'originaux → {outputBytes / 1048576.0:0.0} Mo servis.");
Console.Error.WriteLine($"À ajouter dans CATEGORY_PHOTOS['{category}'] (apps/web/src/app/core/category-photos.ts), puis compléter les textes alternatifs :");
Console.Error.WriteLine();
Console.Write(entries.ToString());
return failures == 0 ? 0 : 2;

string? Option(string name)
{
    var index = Array.IndexOf(args, name);
    return index >= 0 && index + 1 < args.Length ? args[index + 1] : null;
}

static string? FindPhotosRoot()
{
    for (var dir = new DirectoryInfo(Directory.GetCurrentDirectory()); dir is not null; dir = dir.Parent)
    {
        var candidate = Path.Combine(dir.FullName, "apps", "web", "public", "photos");
        if (Directory.Exists(candidate))
        {
            return candidate;
        }
    }
    return null;
}

/// <summary>`Première Danse_Mariés.JPG` → `premiere-danse-maries`.</summary>
static string Slugify(string value)
{
    var normalized = value.Normalize(NormalizationForm.FormD);
    var builder = new StringBuilder();
    foreach (var c in normalized)
    {
        if (CharUnicodeInfo.GetUnicodeCategory(c) == UnicodeCategory.NonSpacingMark)
        {
            continue;
        }
        builder.Append(char.IsAsciiLetterOrDigit(c) ? char.ToLowerInvariant(c) : '-');
    }
    var slug = string.Join('-', builder.ToString().Split('-', StringSplitOptions.RemoveEmptyEntries));
    return slug.Length > 0 ? slug : "photo";
}
