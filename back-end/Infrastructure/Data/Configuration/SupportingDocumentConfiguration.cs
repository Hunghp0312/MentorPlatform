using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class SupportingDocumentConfiguration : IEntityTypeConfiguration<SupportingDocument>
    {
        public void Configure(EntityTypeBuilder<SupportingDocument> builder)
        {
            builder.HasKey(sd => sd.Id);
            builder.Property(sd => sd.MentorApplicationId).IsRequired(false);
            builder.Property(sd => sd.DocumentContentId).IsRequired();
            builder.Property(sd => sd.FileName).IsRequired().HasMaxLength(255);
            builder.Property(sd => sd.FileType).IsRequired().HasMaxLength(100);
            builder.Property(sd => sd.FileSize).IsRequired();
            builder.Property(sd => sd.UploadedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(sd => sd.DocumentContent)
                   .WithOne(dc => dc.SupportingDocument)
                   .HasForeignKey<SupportingDocument>(sd => sd.DocumentContentId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(sd => sd.MentorApplication)
                .WithMany(ma => ma.SupportingDocuments)
                .HasForeignKey(sd => sd.MentorApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
