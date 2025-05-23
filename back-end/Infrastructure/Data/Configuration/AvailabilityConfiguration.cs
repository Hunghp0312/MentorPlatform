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
            builder.HasData(new[]
            {
                new Availability { Id = 1, Name = "Weekdays" },
                new Availability { Id = 2, Name = "Weekends" },
                new Availability { Id = 3, Name = "Mornings" },
                new Availability { Id = 4, Name = "Afternoons" },
                new Availability { Id = 5, Name = "Evenings" }
            });
        }
    }
}