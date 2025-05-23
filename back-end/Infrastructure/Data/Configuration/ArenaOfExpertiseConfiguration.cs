using Infrastructure.Data.Seeding;
using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class ArenaOfExpertiseConfiguration : IEntityTypeConfiguration<ArenaOfExpertise>
    {
        public void Configure(EntityTypeBuilder<ArenaOfExpertise> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(200);
            builder.HasIndex(a => a.Name).IsUnique();

            builder.HasData(ArenaOfExpertiseSeeding.SeedArenasOfExpertise());
        }
    }
}
