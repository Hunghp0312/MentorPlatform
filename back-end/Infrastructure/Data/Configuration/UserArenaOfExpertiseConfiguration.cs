using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserArenaOfExpertiseConfiguration : IEntityTypeConfiguration<UserArenaOfExpertise>
    {
        public void Configure(EntityTypeBuilder<UserArenaOfExpertise> builder)
        {
            builder.HasKey(uae => new { uae.UserId, uae.ArenaOfExpertiseId });

            builder.HasOne(uae => uae.User)
                .WithMany(up => up.UserArenaOfExpertises)
                .HasForeignKey(uae => uae.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(uae => uae.ArenaOfExpertise)
                .WithMany(a => a.UserArenaOfExpertises)
                .HasForeignKey(uae => uae.ArenaOfExpertiseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
