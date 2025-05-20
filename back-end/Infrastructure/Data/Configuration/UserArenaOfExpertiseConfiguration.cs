using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserArenaOfExpertiseConfiguration : IEntityTypeConfiguration<UserArenaOfExpertise>
    {
        public void Configure(EntityTypeBuilder<UserArenaOfExpertise> builder)
        {
            // Khóa chính kết hợp
            builder.HasKey(uae => new { uae.UserProfileId, uae.ArenaOfExpertiseId });

            builder.HasOne(uae => uae.UserProfile)
                .WithMany(up => up.UserArenaOfExpertises)
                .HasForeignKey(uae => uae.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(uae => uae.ArenaOfExpertise)
                .WithMany(a => a.UserArenaOfExpertises)
                .HasForeignKey(uae => uae.ArenaOfExpertiseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
