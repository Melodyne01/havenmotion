using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StudioVnl.Application.Abstractions;

namespace StudioVnl.Infrastructure.Email;

public class EmailOptions
{
    public const string Section = "Email";

    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 1025;
    public bool UseSsl { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
    public string FromAddress { get; set; } = "no-reply@heavenmotion.be";
    public string FromName { get; set; } = "Heaven Motion";

    /// <summary>Boîte du studio, destinataire des notifications de devis.</summary>
    public string StudioAddress { get; set; } = "contact@heavenmotion.be";
}

/// <summary>Envoi SMTP (Mailpit en dev, relais du fournisseur en prod).</summary>
public class SmtpEmailSender(IOptions<EmailOptions> options, ILogger<SmtpEmailSender> logger)
    : IEmailSender
{
    private readonly EmailOptions _options = options.Value;

    public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken)
    {
        using var client = new SmtpClient(_options.Host, _options.Port)
        {
            EnableSsl = _options.UseSsl,
        };
        if (!string.IsNullOrEmpty(_options.UserName))
        {
            client.Credentials = new NetworkCredential(_options.UserName, _options.Password);
        }

        using var mail = new MailMessage
        {
            From = new MailAddress(_options.FromAddress, _options.FromName),
            Subject = message.Subject,
            Body = message.HtmlBody,
            IsBodyHtml = true,
        };
        mail.To.Add(message.To);

        try
        {
            await client.SendMailAsync(mail, cancellationToken);
        }
        catch (SmtpException exception)
        {
            // Un incident d'e-mail ne doit jamais faire perdre une demande de
            // devis : le lead est déjà en base, on trace et on continue.
            logger.LogError(exception, "Envoi SMTP en échec vers {To}", message.To);
        }
    }
}
