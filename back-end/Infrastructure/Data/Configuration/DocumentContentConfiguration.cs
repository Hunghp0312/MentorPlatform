using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class DocumentContentConfiguration : IEntityTypeConfiguration<DocumentContent>
    {
        public void Configure(EntityTypeBuilder<DocumentContent> builder)
        {
            builder.HasKey(d => d.SupportingDocumentId);
            builder.HasOne(dc => dc.SupportingDocument)
                   .WithOne(sd => sd.DocumentContent)
                   .HasForeignKey<DocumentContent>(dc => dc.SupportingDocumentId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Property(sd => sd.FileContent).HasColumnType("varbinary(max)").IsRequired();

        }
    }
}
