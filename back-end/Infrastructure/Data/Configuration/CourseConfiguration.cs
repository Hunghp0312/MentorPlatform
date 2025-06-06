using Infrastructure.Data.Seeding;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class CourseConfiguration : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {
            builder.ToTable("Course");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name).IsRequired().HasMaxLength(100);

            builder.Property(c => c.Description).IsRequired().HasMaxLength(1000);

            builder.Property(c => c.Duration).IsRequired().HasMaxLength(50);

            builder.Property(c => c.Created).IsRequired();

            builder.Property(c => c.MentorId).IsRequired();

            builder.Property(c => c.Tags).IsRequired().HasMaxLength(100);
            builder.Property(c => c.MentorId).IsRequired(false);
            builder
                .HasOne(c => c.Status)
                .WithMany()
                .HasForeignKey(c => c.StatusId)
                .OnDelete(DeleteBehavior.Restrict);
            builder
                .HasOne(c => c.Level)
                .WithMany()
                .HasForeignKey(c => c.LevelId)
                .OnDelete(DeleteBehavior.Restrict);
            builder
                .HasOne(c => c.Category)
                .WithMany(c => c.Courses)
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(c => c.Resources).WithOne(r => r.Course).HasForeignKey(r => r.CourseId).OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Mentor)
                .WithMany(m => m.MentoredCourses)
                .HasForeignKey(c => c.MentorId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(CourseSeeding.SeedCourses());
        }
    }
}
