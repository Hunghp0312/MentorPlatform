using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserTopicOfInterestConfiguration : IEntityTypeConfiguration<UserTopicOfInterest>
    {
        public void Configure(EntityTypeBuilder<UserTopicOfInterest> builder)
        {
            builder.HasKey(uti => new { uti.UserId, uti.TopicId });

            builder.HasOne(uti => uti.User)
                .WithMany(u => u.UserTopicOfInterests)
                .HasForeignKey(uti => uti.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
