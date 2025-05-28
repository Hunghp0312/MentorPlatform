using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class CommunicationMethodConfiguration : BaseTypeConfiguration<CommunicationMethod>
    {
        public override void Configure(EntityTypeBuilder<CommunicationMethod> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new CommunicationMethod { Id = 1, Name = "Video Call" },
                new CommunicationMethod { Id = 2, Name = "Audio Call" },
                new CommunicationMethod { Id = 3, Name = "Text Chat" }
            );
        }
    }
}