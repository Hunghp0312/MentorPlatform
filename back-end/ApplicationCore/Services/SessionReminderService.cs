using System.Text;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class SessionReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SessionReminderService> _logger;
        private readonly ISendEmailService _sendEmailService;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Check every 5 minutes

        public SessionReminderService(IServiceProvider serviceProvider, ILogger<SessionReminderService> logger, ISendEmailService sendEmailService)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _sendEmailService = sendEmailService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SessionReminderService started.");
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAndSendRemindersAsync();
                await Task.Delay(_checkInterval, stoppingToken);
            }
            _logger.LogInformation("SessionReminderService stopped.");
        }

        private async Task CheckAndSendRemindersAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var sessionBookingRepository = scope.ServiceProvider.GetRequiredService<ISessionBookingRepository>();

            var now = DateTime.UtcNow;
            var oneHourFromNow = now.AddHours(1);
            var sessions = await sessionBookingRepository.GetAllAsync();

            var upcomingSessions = sessions
                .Where(s => s.StatusId == 6 &&
                            s.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(s.MentorTimeAvailable.Start) >= now &&
                            s.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(s.MentorTimeAvailable.Start) <= oneHourFromNow)
                .ToList();

            foreach (var session in upcomingSessions)
            {
                var bodyBuilder = new StringBuilder();
                if (session.Mentor?.Email == null)
                {
                    _logger.LogWarning("No email found for mentor of session {SessionId}.", session.Id);
                    continue;
                }
                var emailSubject = $"Reminder: Upcoming Session {session.Id}";
                var body = $@"<h3>Session Reminder</h3>
                            <p>Dear {session.Mentor.UserProfile.FullName},</p>
                            <p>You have a session scheduled at {session.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(session.MentorTimeAvailable.Start):dd/MM/yyyy HH:mm} (UTC).</p>
                            <p>Session ID: {session.Id}</p>
                            <p>Please prepare for your session.</p>";
                bodyBuilder.AppendLine($"{body}");
                var emailRecipient = session.Mentor.Email;
                var emailBody = bodyBuilder.ToString();

                await _sendEmailService.SendEmail(emailRecipient, emailSubject, emailBody);

                _logger.LogInformation("Reminder email sent for session {SessionId} to {Email}.", session.Id, session.Mentor.Email);
            }
        }
    }
}