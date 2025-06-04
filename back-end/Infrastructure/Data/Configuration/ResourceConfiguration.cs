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
            builder.Property(r => r.Title).HasMaxLength(200).IsRequired(true);
            builder.Property(r => r.CourseId).IsRequired(true);
            builder.Property(r => r.TypeOfResource).IsRequired(true);
            builder.Property(r => r.ResourceCategory).IsRequired(true);
            builder.Property(r => r.Description).HasMaxLength(1000).IsRequired(false);

            builder.HasOne(r => r.SupportingDocument)
                      .WithOne(dc => dc.Resource)
                      .HasForeignKey<Resource>(r => r.SuportingDocumentId)
                      .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
