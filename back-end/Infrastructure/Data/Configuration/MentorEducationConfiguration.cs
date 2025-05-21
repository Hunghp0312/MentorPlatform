using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorEducationConfiguration : IEntityTypeConfiguration<MentorEducation>
    {
        public void Configure(EntityTypeBuilder<MentorEducation> builder)
        {
            builder.HasKey(me => me.Id);
            builder.Property(me => me.MentorApplicationId).IsRequired();
            builder.Property(me => me.InstitutionName).IsRequired().HasMaxLength(255);
            builder.Property(me => me.FieldOfStudy).IsRequired().HasMaxLength(150);
            builder.Property(me => me.GraduationYear).IsRequired(false);

            builder.HasOne(me => me.MentorApplication)
                .WithMany(ma => ma.MentorEducations)
                .HasForeignKey(me => me.MentorApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
