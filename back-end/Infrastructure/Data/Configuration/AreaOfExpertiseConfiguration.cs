using Infrastructure.Data.Seeding;
using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class AreaOfExpertiseConfiguration : IEntityTypeConfiguration<AreaOfExpertise>
    {
        public void Configure(EntityTypeBuilder<AreaOfExpertise> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(200);
            builder.HasIndex(a => a.Name).IsUnique();

            builder.HasData(AreaOfExpertiseSeeding.SeedAreasOfExpertise());
        }
    }
}
