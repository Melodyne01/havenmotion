using System.Net;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Infrastructure.Email;

/// <summary>Gabarits HTML noir &amp; ambre des e-mails de devis.</summary>
public static class LeadEmailTemplates
{
    private const string Amber = "#F2B33D";
    private const string Charcoal = "#0B0B0C";
    private const string Film = "#F2EFE9";

    public static string StudioNotification(Lead lead, string brandName) => Wrap(
        brandName,
        "Nouvelle demande de devis",
        $"""
        <p style="margin:0 0 16px">Une nouvelle demande vient d'arriver sur le site.</p>
        {Row("Nom", lead.Name)}
        {Row("E-mail", lead.Email)}
        {Row("Projet", lead.ProjectType)}
        {Row("Date", lead.EventDate?.ToString("dd/MM/yyyy") ?? "non précisée")}
        {Row("Budget", lead.BudgetRange)}
        {Row("Message", string.IsNullOrWhiteSpace(lead.Message) ? "—" : lead.Message)}
        """);

    public static string ProspectAcknowledgement(Lead lead, string brandName) => Wrap(
        brandName,
        "Votre demande est bien reçue",
        $"""
        <p style="margin:0 0 16px">Bonjour {WebUtility.HtmlEncode(lead.Name)},</p>
        <p style="margin:0 0 16px">
          Merci pour votre demande de devis ({WebUtility.HtmlEncode(lead.ProjectType)}).
          Elle est bien arrivée : réponse chiffrée sous 48&nbsp;heures ouvrées.
        </p>
        <p style="margin:0">À très vite,<br />{WebUtility.HtmlEncode(brandName)}</p>
        """);

    private static string Row(string label, string value) =>
        $"""
        <p style="margin:0 0 8px">
          <span style="color:{Amber};text-transform:uppercase;letter-spacing:.14em;font-size:11px">{label}</span><br />
          <span>{WebUtility.HtmlEncode(value)}</span>
        </p>
        """;

    private static string Wrap(string brandName, string title, string body) =>
        $"""
        <!doctype html>
        <html lang="fr">
          <body style="margin:0;padding:32px 16px;background:{Charcoal};color:{Film};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6">
            <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,255,255,.16)">
              <div style="padding:20px 24px;border-bottom:2px solid {Amber}">
                <strong style="text-transform:uppercase;letter-spacing:.14em">
                  {WebUtility.HtmlEncode(brandName)}
                </strong>
              </div>
              <div style="padding:24px">
                <h1 style="margin:0 0 20px;font-size:20px;text-transform:uppercase;letter-spacing:.14em;color:{Amber}">
                  {WebUtility.HtmlEncode(title)}
                </h1>
                {body}
              </div>
            </div>
          </body>
        </html>
        """;
}
