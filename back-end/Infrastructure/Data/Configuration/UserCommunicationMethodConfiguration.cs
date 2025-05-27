using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserCommunicationMethodConfiguration : IEntityTypeConfiguration<UserCommunicationMethod>
    {
        public void Configure(EntityTypeBuilder<UserCommunicationMethod> builder)
        {
            builder.HasKey(uae => new { uae.UseProfileId, uae.CommunicationMethodId });

            builder.HasOne(uae => uae.UserProfile)
                .WithMany(up => up.UserCommunicationMethods)
                .HasForeignKey(uae => uae.UseProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
