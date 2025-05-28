using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserTopicOfInterestConfiguration : IEntityTypeConfiguration<UserTopicOfInterest>
    {
        public void Configure(EntityTypeBuilder<UserTopicOfInterest> builder)
        {
            builder.HasKey(uti => new { uti.UserProfileId, uti.TopicId });

            builder.HasOne(uti => uti.UserProfile)
                .WithMany(u => u.UserTopicOfInterests)
                .HasForeignKey(uti => uti.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(uti => uti.Topic)
              .WithMany()
              .HasForeignKey(uti => uti.TopicId)
              .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
