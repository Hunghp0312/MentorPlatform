using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class ResourceDownloadConfiguration : IEntityTypeConfiguration<ResourceDownload>
    {
        public void Configure(EntityTypeBuilder<ResourceDownload> builder)
        {
            builder.HasKey(r => r.Id);
            builder.Property(rd => rd.ResourceId)
              .IsRequired(false);

            builder.Property(rd => rd.DocumentContentId)
                .IsRequired(false);
            builder.Property(rd => rd.FileSize)
                .IsRequired()
                .HasDefaultValue(0);

            builder.HasOne(rd => rd.Resource)
               .WithMany(r => r.ResourceDownloads)
               .HasForeignKey(rd => rd.ResourceId)
               .OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(rd => rd.DocumentContent)
               .WithMany()
               .HasForeignKey(rd => rd.DocumentContentId)
               .OnDelete(DeleteBehavior.SetNull);
        }

    }
}