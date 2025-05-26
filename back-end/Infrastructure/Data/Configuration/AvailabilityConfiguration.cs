using Infrastructure.Data.Seeding;
using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class AvailabilityConfiguration : IEntityTypeConfiguration<Availability>
    {
        public void Configure(EntityTypeBuilder<Availability> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(200);
            builder.HasIndex(a => a.Name).IsUnique();
            builder.HasData(AvailabilitySeeding.SeedAvailability());
        }
    }
}