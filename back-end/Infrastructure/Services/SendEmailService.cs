
using MailKit.Net.Smtp;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Security;
using Infrastructure.Entities;
using Microsoft.VisualBasic;

namespace Infrastructure.Services
{
    public class SendEmailService : ISendEmailService
    {
        private readonly EmailSettingOption _emailSettingOption;
        public SendEmailService(IOptions<EmailSettingOption> emailSettingOption)
        {
            _emailSettingOption = emailSettingOption.Value;
        }

        public async Task SendEmail(string to, string subject, string body, bool isBodyHtml = true)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettingOption.DisplayName, _emailSettingOption.UserName));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = body
            };
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emailSettingOption.Host, _emailSettingOption.Port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettingOption.UserName, _emailSettingOption.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }

    }
}