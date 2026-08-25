namespace StudioVnl.Application.Abstractions;

public record EmailMessage(string To, string Subject, string HtmlBody);

/// <summary>Envoi transactionnel (SMTP ou SendGrid selon la configuration).</summary>
public interface IEmailSender
{
    Task SendAsync(EmailMessage message, CancellationToken cancellationToken);
}
