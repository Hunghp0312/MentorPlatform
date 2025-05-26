using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorTeachingApproachConfiguration : IEntityTypeConfiguration<MentorTeachingApproach>
    {
        public void Configure(EntityTypeBuilder<MentorTeachingApproach> builder)
        {
            builder.HasKey(mta => new { mta.UserId, mta.TeachingApproachId });

            builder.HasOne(mta => mta.User)
                .WithMany()
                .HasForeignKey(mta => mta.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(mta => mta.TeachingApproach)
                .WithMany()
                .HasForeignKey(mta => mta.TeachingApproachId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
