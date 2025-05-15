using ApplicationCore.Entity;
using Infrastructure.Data.Seeding;
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

            builder.Property(c => c.Title).IsRequired().HasMaxLength(100);

            builder.Property(c => c.Description).IsRequired().HasMaxLength(1000);

            builder.Property(c => c.Status).IsRequired();

            builder.Property(c => c.Difficulty).IsRequired();

            builder.Property(c => c.Duration).IsRequired().HasMaxLength(50);

            builder.Property(c => c.Created).IsRequired();

            builder
                .HasOne(c => c.Category)
                .WithMany(c => c.Courses)
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(CourseSeeding.SeedCourses());
        }
    }
}
