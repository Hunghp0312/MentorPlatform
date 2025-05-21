using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
    {
        public void Configure(EntityTypeBuilder<UserProfile> builder)
        {
            builder.HasKey(up => up.Id);

            builder.HasOne(up => up.User)
                   .WithOne(u => u.UserProfile)
                   .HasForeignKey<UserProfile>(up => up.Id)
                   .OnDelete(DeleteBehavior.Cascade);


            builder.Property(up => up.PhotoData)
                   .HasColumnType("varbinary(max)")
                   .IsRequired(false);

            builder.Property(up => up.FullName).HasMaxLength(200).IsRequired(false);
            builder.Property(up => up.Bio).HasMaxLength(1000).IsRequired(false);
            builder.Property(up => up.ProfessionalSkill).HasMaxLength(1000).IsRequired(false);
            builder.Property(up => up.IndustryExperience).HasMaxLength(1000).IsRequired(false);
            builder.Property(up => up.UserGoal).HasMaxLength(1000).IsRequired(false);

            builder.Property(up => up.AvailabilityData).IsRequired(false);
            builder.Property(up => up.SessionFrequency).IsRequired(false);
            builder.Property(up => up.SessionDuration).IsRequired(false);
            builder.Property(up => up.LearningStyle).IsRequired(false);
            builder.Property(up => up.TeachingApproach).IsRequired(false);
            builder.Property(up => up.CommunicationMethod).IsRequired(false);

            builder.Property(up => up.PrivacyProfile).IsRequired().HasDefaultValue(true);
            builder.Property(up => up.MessagePermission).IsRequired().HasDefaultValue(true);
            builder.Property(up => up.NotificationsEnabled).IsRequired().HasDefaultValue(true);
        }
    }
}
