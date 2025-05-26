using Infrastructure.Data.Seeding;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserAreaOfExpertiseConfiguration : IEntityTypeConfiguration<UserAreaOfExpertise>
    {
        public void Configure(EntityTypeBuilder<UserAreaOfExpertise> builder)
        {
            builder.HasKey(uae => new { uae.UserId, uae.AreaOfExpertiseId });

            builder.HasOne(uae => uae.User)
                .WithMany(up => up.UserArenaOfExpertises)
                .HasForeignKey(uae => uae.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasData(UserAreaOfExpertiseSeeding.SeedUserAreasOfExpertise());
        }
    }
}
