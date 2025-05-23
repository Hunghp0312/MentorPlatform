using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class AvailabilityConfiguration : BaseTypeConfiguration<Availability>
    {
        public override void Configure(EntityTypeBuilder<Availability> builder)
        {
            base.Configure(builder);
            builder.HasData(
                new Availability { Id = 1, Name = "Weekdays" },
                new Availability { Id = 2, Name = "Weekends" },
                new Availability { Id = 3, Name = "Mornings" },
                new Availability { Id = 4, Name = "Afternoons" },
                new Availability { Id = 5, Name = "Evenings" }
            );
        }
    }
}
