

using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class TypeOfResourceConfiguration : BaseTypeConfiguration<TypeOfResource>
    {
        public override void Configure(EntityTypeBuilder<TypeOfResource> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new TypeOfResource { Id = 1, Name = "Video" },
                new TypeOfResource { Id = 2, Name = "Pdf" },
                new TypeOfResource { Id = 3, Name = "External Link" }
            );
        }
    }
}