﻿using Infrastructure.Data.Seeding;
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
            builder.HasOne(up => up.CommunicationMethod)
                     .WithMany()
                     .HasForeignKey(up => up.CommunicationMethodId)
                     .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(UserProfileSeeding.SeedUserProfiles());
        }
    }
}
