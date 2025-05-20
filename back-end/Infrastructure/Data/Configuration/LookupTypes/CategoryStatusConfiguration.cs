using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class CategoryStatusConfiguration : BaseTypeConfiguration<CategoryStatus>
    {
        public override void Configure(EntityTypeBuilder<CategoryStatus> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new CategoryStatus { Id = 1, Name = "Inactive" },
                new CategoryStatus { Id = 2, Name = "Active" }
            );
        }
    }
}
