using FluentValidation;
using StudioVnl.Application;
using StudioVnl.Application.Dtos;

namespace StudioVnl.Application.Validation;

public class CreateLeadValidator : AbstractValidator<CreateLeadRequest>
{
    /// <summary>Codes des formules, alignés sur `PackType` côté front (`packs.ts`).</summary>
    public static readonly string[] PackTypes = ["photo", "video", "combo", "custom"];

    public CreateLeadValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(180);
        RuleFor(x => x.ProjectType).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Pack)
            .Must(pack => string.IsNullOrEmpty(pack) || PackTypes.Contains(pack))
            .WithMessage("Formule inconnue : photo, video, combo ou custom.");
        RuleFor(x => x.Region).MaximumLength(80).Matches("^[a-z0-9-]*$")
            .WithMessage("La région doit être un identifiant en minuscules, chiffres et tirets.");
        RuleFor(x => x.Locale)
            .Must(locale => string.IsNullOrEmpty(locale) || Locales.All.Contains(locale))
            .WithMessage("Langue inconnue : fr, nl ou en.");
        RuleFor(x => x.BudgetRange).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Message).MaximumLength(2000);
        RuleFor(x => x.EventDate)
            .Must(BeAValidDate)
            .WithMessage("La date doit être au format yyyy-MM-dd.");

        // Pot de miel : un humain laisse le champ vide, un robot le remplit.
        RuleFor(x => x.Website)
            .Must(string.IsNullOrEmpty)
            .WithMessage("Requête rejetée.");
    }

    private static bool BeAValidDate(string? value) =>
        string.IsNullOrEmpty(value) || DateOnly.TryParseExact(value, "yyyy-MM-dd", out _);
}

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(200);
    }
}

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Slug)
            .NotEmpty()
            .MaximumLength(60)
            .Matches("^[a-z0-9][a-z0-9-]*$")
            .WithMessage("Le slug ne peut contenir que des minuscules, chiffres et tirets.");
        RuleFor(x => x.Tagline).MaximumLength(200);
        RuleFor(x => x.FilmCount).GreaterThanOrEqualTo(0).When(x => x.FilmCount.HasValue);
    }
}

public class SaveFilmValidator : AbstractValidator<SaveFilmRequest>
{
    public SaveFilmValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Client).MaximumLength(120);
        RuleFor(x => x.Duration).MaximumLength(40);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.Status)
            .Must(status => status is "Draft" or "Published")
            .WithMessage("Statut inconnu : Draft ou Published.");
        RuleFor(x => x.Date)
            .Must(value => string.IsNullOrEmpty(value) || DateOnly.TryParseExact(value, "yyyy-MM-dd", out _))
            .WithMessage("La date doit être au format yyyy-MM-dd.");
    }
}

public class StartUploadValidator : AbstractValidator<StartUploadRequest>
{
    /// <summary>4 Go : borne haute d'un master de showreel.</summary>
    public const long MaxSizeBytes = 4L * 1024 * 1024 * 1024;

    public static readonly string[] AllowedContentTypes =
    [
        "video/mp4",
        "video/quicktime",
        "video/x-matroska",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
    ];

    public StartUploadValidator()
    {
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(255);
        RuleFor(x => x.ContentType)
            .Must(type => AllowedContentTypes.Contains(type))
            .WithMessage("Type de fichier non pris en charge.");
        RuleFor(x => x.SizeBytes).GreaterThan(0).LessThanOrEqualTo(MaxSizeBytes);
        RuleFor(x => x.TotalChunks).GreaterThan(0).LessThanOrEqualTo(2048);
    }
}

public class UpdateSettingsValidator : AbstractValidator<UpdateSettingsRequest>
{
    public UpdateSettingsValidator()
    {
        RuleFor(x => x.BrandName).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(180);
        RuleFor(x => x.Tagline).MaximumLength(200);
        RuleFor(x => x.Instagram).MaximumLength(80);
        RuleFor(x => x.City).MaximumLength(80);
        RuleFor(x => x.Region).MaximumLength(80);
        RuleFor(x => x.LegalText).MaximumLength(2000);
    }
}

public class SaveServiceValidator : AbstractValidator<SaveServiceRequest>
{
    public SaveServiceValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Duration).MaximumLength(120);
        RuleFor(x => x.Deliverables).MaximumLength(300);
        RuleFor(x => x.StartingPrice).MaximumLength(80);
        RuleForEach(x => x.Included).MaximumLength(160);
    }
}

public class SaveTestimonialValidator : AbstractValidator<SaveTestimonialRequest>
{
    public SaveTestimonialValidator()
    {
        RuleFor(x => x.Quote).NotEmpty().MaximumLength(600);
        RuleFor(x => x.Author).MaximumLength(120);
        RuleFor(x => x.Role).MaximumLength(120);
    }
}

public class SaveProcessStepValidator : AbstractValidator<SaveProcessStepRequest>
{
    public SaveProcessStepValidator()
    {
        RuleFor(x => x.Index).NotEmpty().MaximumLength(4);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Body).MaximumLength(400);
    }
}

public class SaveClientLogoValidator : AbstractValidator<SaveClientLogoRequest>
{
    public SaveClientLogoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.ImageUrl).MaximumLength(500);
    }
}

public class UpdateLeadStatusValidator : AbstractValidator<UpdateLeadStatusRequest>
{
    public UpdateLeadStatusValidator()
    {
        RuleFor(x => x.Status)
            .Must(status => status is "New" or "Handled" or "Won" or "Lost")
            .WithMessage("Statut inconnu : New, Handled, Won ou Lost.");
    }
}

public class SaveProjectValidator : AbstractValidator<SaveProjectRequest>
{
    private static readonly string[] CategoryKeys = ["evenementiel", "mariage", "corporate", "sport", "clip", "lifestyle"];

    public SaveProjectValidator()
    {
        RuleFor(x => x.Slug)
            .NotEmpty()
            .MaximumLength(120)
            .Matches("^[a-z0-9][a-z0-9-]*$")
            .WithMessage("Le slug ne peut contenir que des minuscules, chiffres et tirets.");
        RuleFor(x => x.CategoryKey)
            .Must(CategoryKeys.Contains)
            .WithMessage("Catégorie inconnue.");
        RuleFor(x => x.RegionId).MaximumLength(80).Matches("^[a-z0-9-]*$");
        RuleFor(x => x.Venue).MaximumLength(160);
        RuleFor(x => x.City).MaximumLength(120);
        RuleFor(x => x.CountryCode).Length(2);
        RuleFor(x => x.Pack)
            .Must(pack => string.IsNullOrEmpty(pack) || CreateLeadValidator.PackTypes.Contains(pack))
            .WithMessage("Formule inconnue : photo, video, combo ou custom.");
        RuleFor(x => x.Date)
            .Must(value => string.IsNullOrEmpty(value) || DateOnly.TryParseExact(value, "yyyy-MM-dd", out _))
            .WithMessage("La date doit être au format yyyy-MM-dd.");
        RuleFor(x => x.Status)
            .Must(status => status is "Draft" or "Published")
            .WithMessage("Statut inconnu : Draft ou Published.");
        // Au moins une langue remplie : un projet sans titre n'a de page nulle part.
        RuleFor(x => x)
            .Must(x => !string.IsNullOrWhiteSpace(x.Fr.Title) || !string.IsNullOrWhiteSpace(x.Nl.Title) || !string.IsNullOrWhiteSpace(x.En.Title))
            .WithMessage("Renseignez le titre dans au moins une langue.");
        foreach (var text in new Func<SaveProjectRequest, ProjectTextRequest>[] { x => x.Fr, x => x.Nl, x => x.En })
        {
            RuleFor(x => text(x).Title).MaximumLength(160);
            RuleFor(x => text(x).Summary).MaximumLength(400);
            RuleFor(x => text(x).Body).MaximumLength(12000);
        }
        RuleFor(x => x.Gallery).Must(g => g.Count <= 60).WithMessage("60 médias maximum dans la galerie.");
    }
}

public class SaveReviewValidator : AbstractValidator<SaveReviewRequest>
{
    public SaveReviewValidator()
    {
        RuleFor(x => x.Author).NotEmpty().MaximumLength(120);
        RuleFor(x => x.City).MaximumLength(120);
        RuleFor(x => x.CategoryKey).MaximumLength(40);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Locale).Must(Locales.All.Contains).WithMessage("Langue inconnue : fr, nl ou en.");
        RuleFor(x => x.Quote).NotEmpty().MaximumLength(1200);
        RuleFor(x => x.Source).MaximumLength(60);
        RuleFor(x => x.Date)
            .Must(value => string.IsNullOrEmpty(value) || DateOnly.TryParseExact(value, "yyyy-MM-dd", out _))
            .WithMessage("La date doit être au format yyyy-MM-dd.");
    }
}
