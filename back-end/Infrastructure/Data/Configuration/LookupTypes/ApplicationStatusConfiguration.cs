using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class ApplicationStatusConfiguration : IEntityTypeConfiguration<ApplicationStatus>
    {
        public void Configure(EntityTypeBuilder<ApplicationStatus> builder)
        {
            builder.HasKey(aps => aps.Id);

            builder.Property(aps => aps.Name)
                .IsRequired()
                .HasMaxLength(50);
            builder.HasIndex(aps => aps.Name).IsUnique();
        }
    }
}