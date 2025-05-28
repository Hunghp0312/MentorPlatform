using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserCommunicationMethodConfiguration : IEntityTypeConfiguration<UserCommunicationMethod>
    {
        public void Configure(EntityTypeBuilder<UserCommunicationMethod> builder)
        {
            builder.HasKey(uae => new { uae.UserProfileId, uae.CommunicationMethodId });

            builder.HasOne(uae => uae.UserProfile)
                .WithMany(up => up.UserCommunicationMethods)
                .HasForeignKey(uae => uae.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(uae => uae.CommunicationMethod)
                .WithMany()
                .HasForeignKey(uae => uae.CommunicationMethodId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
