using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorWorkExperienceConfiguration : IEntityTypeConfiguration<MentorWorkExperience>
    {
        public void Configure(EntityTypeBuilder<MentorWorkExperience> builder)
        {
            builder.HasKey(mwe => mwe.Id);
            builder.Property(mwe => mwe.MentorApplicationId).IsRequired();
            builder.Property(mwe => mwe.CompanyName).IsRequired().HasMaxLength(255);
            builder.Property(mwe => mwe.Position).IsRequired().HasMaxLength(100);
            builder.Property(mwe => mwe.StartDate).IsRequired();
            builder.Property(mwe => mwe.EndDate).IsRequired(false);
            builder.Property(mwe => mwe.Description).IsRequired(false);

            builder.HasOne(mwe => mwe.MentorApplication)
                .WithMany(ma => ma.MentorWorkExperiences)
                .HasForeignKey(mwe => mwe.MentorApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
