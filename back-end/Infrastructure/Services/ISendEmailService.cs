namespace Infrastructure.Services
{
    public interface ISendEmailService
    {
        Task SendEmail(string to,string subject, string body, bool isBodyHtml = true);
    }
}