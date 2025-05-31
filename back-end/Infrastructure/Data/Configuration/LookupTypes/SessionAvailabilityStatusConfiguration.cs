using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class SessionAvailabilityStatusConfiguration : BaseTypeConfiguration<SessionAvailabilityStatus>
    {
        public override void Configure(EntityTypeBuilder<SessionAvailabilityStatus> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new SessionAvailabilityStatus { Id = 1, Name = "Available" },
                new SessionAvailabilityStatus { Id = 2, Name = "Booked" }
            );
        }
    }
}
