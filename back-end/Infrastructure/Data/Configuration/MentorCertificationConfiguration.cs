﻿using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorCertificationConfiguration : IEntityTypeConfiguration<MentorCertification>
    {
        public void Configure(EntityTypeBuilder<MentorCertification> builder)
        {
            builder.HasKey(mc => mc.Id);
            builder.Property(mc => mc.MentorApplicationId).IsRequired();
            builder.Property(mc => mc.CertificationName).IsRequired().HasMaxLength(150);
            builder.Property(mc => mc.IssuingOrganization).IsRequired().HasMaxLength(150);

            builder.HasOne(mc => mc.MentorApplication)
                .WithMany(ma => ma.MentorCertifications)
                .HasForeignKey(mc => mc.MentorApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
