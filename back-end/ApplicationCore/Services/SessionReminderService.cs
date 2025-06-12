using ApplicationCore.Common;
using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Services
{
    public class SessionReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ISendEmailService _sendEmailService;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);

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

            var now = DateTimeHelper.GetCurrentVietnamTime();
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

                if (session.Mentor?.UserProfile?.NotificationsEnabled != true)
                {
                    continue;
                }

                var emailSubject = $"Reminder: Upcoming Session with {session.Learner.UserProfile.FullName}";
                var body = $@"<h3>Session Reminder</h3>
                            <p>Dear {session.Mentor.UserProfile.FullName},</p>
                            <p>This is a kind reminder that you have an upcoming session scheduled with {session.Learner.UserProfile.FullName} - {session.Learner.Email} </p>
                            <p>The session is scheduled at {session.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(session.MentorTimeAvailable.Start):dd/MM/yyyy HH:mm}.</p>
                            <p>Please ensure you are prepared for the session and join on time.</p>
                            <p>If you have any questions or need to reschedule, please contact your learner in advance.</p>
                            <p>Best regards,<br>
                             The MentorPlatform Team</p>";
                var emailRecipient = session.Mentor.Email;

                session.LastReminderSent = DateTime.UtcNow;
                await _sendEmailService.SendEmail(emailRecipient, emailSubject, body);

            }
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            await unitOfWork.SaveChangesAsync();
        }
    }
}