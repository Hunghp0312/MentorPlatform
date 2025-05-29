using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class SessionTypeConfiguration : BaseTypeConfiguration<SessionType>
    {
        public override void Configure(EntityTypeBuilder<SessionType> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new SessionType { Id = 1, Name = "Virtual Session" },
                new SessionType { Id = 2, Name = "In-Person Session" },
                new SessionType { Id = 3, Name = "On-Site Session" }
            );
        }
    }
}
