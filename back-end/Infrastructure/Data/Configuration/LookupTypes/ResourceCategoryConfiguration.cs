using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class ResourceCategoryConfiguration : BaseTypeConfiguration<ResourceCategory>
    {
        public override void Configure(EntityTypeBuilder<ResourceCategory> builder)
        {
            base.Configure(builder);
            builder.HasData(
                new ResourceCategory { Id = 1, Name = "Productivity" },
                new ResourceCategory { Id = 2, Name = "Communication" },
                new ResourceCategory { Id = 3, Name = "Teamwork" },
                new ResourceCategory { Id = 4, Name = "Leadership" }
                );
        }
    }
}