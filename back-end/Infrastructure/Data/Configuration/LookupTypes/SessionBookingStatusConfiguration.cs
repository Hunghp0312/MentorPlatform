using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class SessionBookingStatusConfiguration : BaseTypeConfiguration<SessionBookingStatus>
    {
        public override void Configure(EntityTypeBuilder<SessionBookingStatus> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new SessionBookingStatus { Id = 1, Name = "Pending" },
                new SessionBookingStatus { Id = 2, Name = "Rescheduled" },
                new SessionBookingStatus { Id = 3, Name = "Declined" },
                new SessionBookingStatus { Id = 4, Name = "Completed" },
                new SessionBookingStatus { Id = 5, Name = "Cancelled" },
                new SessionBookingStatus { Id = 6, Name = "Scheduled" }
            );
        }
    }
}
