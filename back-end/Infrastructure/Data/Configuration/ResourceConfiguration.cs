using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class ResourceConfiguration : IEntityTypeConfiguration<Resource>
    {
        public void Configure(EntityTypeBuilder<Resource> builder)
        {
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Title).HasMaxLength(200).IsRequired(false);
            builder.Property(r => r.CourseId).IsRequired(false);
            builder.Property(r => r.Type).IsRequired(false);
            builder.Property(r => r.ResourceCategoryId).IsRequired(false);
            builder.Property(r => r.Description).HasMaxLength(1000).IsRequired(false);
        }
    }
}
