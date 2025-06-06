﻿using Infrastructure.Data.Seeding;
using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class TopicConfiguration : IEntityTypeConfiguration<Topic>
    {
        public void Configure(EntityTypeBuilder<Topic> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(200);
            builder.HasIndex(t => t.Name).IsUnique();

            builder.HasData(TopicSeeding.SeedTopics());
        }
    }
}
