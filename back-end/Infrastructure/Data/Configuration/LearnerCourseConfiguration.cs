using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class LearnerCourseConfiguration : IEntityTypeConfiguration<LearnerCourse>
    {
        public void Configure(EntityTypeBuilder<LearnerCourse> builder)
        {
            builder.HasKey(lc => new { lc.LearnerId, lc.CourseId });
            builder.Property(lc => lc.EnrolledAt)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()");


            builder.HasOne(lc => lc.Learner).WithMany(l => l.LearnerCourses)
                .HasForeignKey(lc => lc.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(lc => lc.Course).WithMany(c => c.LearnerCourses)
                .HasForeignKey(lc => lc.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
