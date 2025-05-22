using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class DocumentContentConfiguration : IEntityTypeConfiguration<DocumentContent>
    {
        public void Configure(EntityTypeBuilder<DocumentContent> builder)
        {
            builder.HasKey(d => d.Id);
            builder.Property(sd => sd.FileContent).HasColumnType("varbinary(max)").IsRequired();

        }
    }
}
