using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserLearningStyleConfiguration : IEntityTypeConfiguration<UserLearningStyle>
    {
        public void Configure(EntityTypeBuilder<UserLearningStyle> builder)
        {
            builder.HasKey(uls => new { uls.UserId, uls.LearningStyleId });

            builder.HasOne(uls => uls.User)
                .WithMany(u => u.UserLearningStyles)
                .HasForeignKey(uls => uls.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(uls => uls.LearningStyle)
                .WithMany()
                .HasForeignKey(uls => uls.LearningStyleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
