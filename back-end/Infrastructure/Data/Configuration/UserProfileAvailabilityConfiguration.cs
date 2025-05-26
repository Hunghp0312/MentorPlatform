using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserProfileAvailabilityConfiguration : IEntityTypeConfiguration<UserProfileAvailability>
    {
        public void Configure(EntityTypeBuilder<UserProfileAvailability> builder)
        {
            // Composite primary key
            builder.HasKey(upa => new { upa.UserId, upa.AvailabilityId });

            // Relationships
            builder.HasOne(upa => upa.UserProfile)
                   .WithMany(up => up.UserProfileAvailabilities)
                   .HasForeignKey(upa => upa.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(upa => upa.Availability)
                   .WithMany()
                   .HasForeignKey(upa => upa.AvailabilityId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}