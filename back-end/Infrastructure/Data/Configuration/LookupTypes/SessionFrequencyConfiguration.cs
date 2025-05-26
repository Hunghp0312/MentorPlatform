using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class SessionFrequencyConfiguration : BaseTypeConfiguration<SessionFrequency>
    {
        public override void Configure(EntityTypeBuilder<SessionFrequency> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new SessionFrequency { Id = 1, Name = "Weekly" },
                new SessionFrequency { Id = 2, Name = "Every two weeks" },
                new SessionFrequency { Id = 3, Name = "Monthly" },
                new SessionFrequency { Id = 4, Name = "As needed" }
            );
        }
    }
}