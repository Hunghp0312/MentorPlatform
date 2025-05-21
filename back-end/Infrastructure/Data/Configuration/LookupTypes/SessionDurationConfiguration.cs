using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class SessionDurationConfiguration : BaseTypeConfiguration<SessionDuration>
    {
        public override void Configure(EntityTypeBuilder<SessionDuration> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new SessionDuration { Id = 1, Name = "30 minutes" },
                new SessionDuration { Id = 2, Name = "45 minutes" },
                new SessionDuration { Id = 3, Name = "1 hour" },
                new SessionDuration { Id = 4, Name = "1.5 hours" },
                new SessionDuration { Id = 5, Name = "2 hours" }
            );
        }
    }
}