using ApplicationCore.Repositories.RepositoryInterfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ApplicationCore.Services
{
    public class ExpiredBookingCancellationService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        private const int PENDING_STATUS = 1;
        private const int CANCELLED_STATUS = 5;

        public ExpiredBookingCancellationService(
            IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CancelExpiredBookings(stoppingToken);
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        private async Task CancelExpiredBookings(CancellationToken stoppingToken)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var sessionBookingRepository = scope.ServiceProvider.GetRequiredService<ISessionBookingRepository>();
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                var utcNow = DateTime.Now;
                var todayUtc = DateOnly.FromDateTime(utcNow);
                var timeNowUtc = TimeOnly.FromDateTime(utcNow);

                var expiredBookings = await sessionBookingRepository
                    .GetAllQueryable()
                    .Include(s => s.MentorTimeAvailable)
                        .ThenInclude(mta => mta.MentorDayAvailable)
                    .Where(s =>
                        s.StatusId == PENDING_STATUS &&
                        (
                            s.MentorTimeAvailable.MentorDayAvailable.Day < todayUtc ||
                            (
                                s.MentorTimeAvailable.MentorDayAvailable.Day == todayUtc &&
                                s.MentorTimeAvailable.Start < timeNowUtc
                            )
                        )
                    )
                    .ToListAsync(stoppingToken);

                if (!expiredBookings.Any())
                {
                    return;
                }

                foreach (var booking in expiredBookings)
                {
                    booking.StatusId = CANCELLED_STATUS;
                    booking.CancelReason = "Booking request expired automatically.";
                    sessionBookingRepository.Update(booking);
                }

                await unitOfWork.SaveChangesAsync();
            }
        }
    }
}
