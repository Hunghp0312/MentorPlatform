using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class AvailabilityConfiguration : BaseTypeConfiguration<AvailabilityData>
    {
        public override void Configure(EntityTypeBuilder<AvailabilityData> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new AvailabilityData { Id = 1, Name = "Weekdays" },
                new AvailabilityData { Id = 2, Name = "Weekends" },
                new AvailabilityData { Id = 3, Name = "Mornings" },
                new AvailabilityData { Id = 4, Name = "Afternoons" },
                new AvailabilityData { Id = 5, Name = "Evenings" }
            );
        }
    }
}