using System.Text;
using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class SessionReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ISendEmailService _sendEmailService;
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(5); // Check every 5 minutes

        public SessionReminderService(IServiceProvider serviceProvider, ISendEmailService sendEmailService)
        {
            _serviceProvider = serviceProvider;
            _sendEmailService = sendEmailService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAndSendRemindersAsync();
                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndSendRemindersAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var sessionBookingRepository = scope.ServiceProvider.GetRequiredService<ISessionBookingRepository>();

            var now = DateTime.UtcNow;
            var oneHourFromNow = now.AddHours(24);
            var sessions = await sessionBookingRepository.GetAllAsync();
            if (sessions == null || !sessions.Any())
            {
                return;
            }


            var upcomingSessions = sessions
          .Where(s => s.MentorTimeAvailable?.MentorDayAvailable != null &&
                      s.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(s.MentorTimeAvailable.Start) is var sessionTime &&
                      sessionTime >= now &&
                      sessionTime <= oneHourFromNow &&
                      (s.LastReminderSent == null || s.LastReminderSent < sessionTime.AddHours(-24)))
          .ToList();
            if (!upcomingSessions.Any())
            {
                return;
            }

            foreach (var session in upcomingSessions)
            {

                var emailSubject = $"Reminder: Upcoming Session {session.Id}";
                var body = $@"<h3>Session Reminder</h3>
                            <p>Dear {session.Mentor.UserProfile.FullName},</p>
                            <p>You have a session with {session.Learner.UserProfile.FullName} scheduled at {session.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(session.MentorTimeAvailable.Start):dd/MM/yyyy HH:mm} (UTC).</p>
                            <p>Session ID: {session.Id}</p>
                            <p>Please prepare for your session.</p>";
                var emailRecipient = session.Mentor.Email;

                session.LastReminderSent = DateTime.UtcNow;
                await _sendEmailService.SendEmail(emailRecipient, emailSubject, body);

            }
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            await unitOfWork.SaveChangesAsync();
        }
    }
}