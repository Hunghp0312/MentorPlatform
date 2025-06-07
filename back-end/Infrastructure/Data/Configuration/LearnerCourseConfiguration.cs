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
            builder.Property(lc => lc.EnrolledAt).IsRequired().HasDefaultValueSql("GETDATE()");

            builder
                .HasOne(lc => lc.Learner)
                .WithMany(l => l.LearnerCourses)
                .HasForeignKey(lc => lc.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(lc => lc.Course)
                .WithMany(c => c.LearnerCourses)
                .HasForeignKey(lc => lc.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasData(
                new List<LearnerCourse>
                {
                    new LearnerCourse
                    {
                        LearnerId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                        CourseId = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72848"),
                        EnrolledAt = new DateTime(2025, 6, 3, 9, 0, 0),
                        CompletedAt = null,
                        IsCompleted = false,
                    },
                    new LearnerCourse
                    {
                        LearnerId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                        CourseId = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72847"),
                        EnrolledAt = new DateTime(2025, 5, 15, 10, 30, 0),
                        CompletedAt = null,
                        IsCompleted = false,
                    },
                    new LearnerCourse
                    {
                        LearnerId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                        CourseId = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72846"),
                        EnrolledAt = new DateTime(2025, 3, 20, 14, 45, 0),
                        CompletedAt = null,
                        IsCompleted = true,
                    },
                    new LearnerCourse
                    {
                        LearnerId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                        CourseId = Guid.Parse("8d02b327-6370-41c7-95bb-6a8d72b72844"),
                        EnrolledAt = new DateTime(2023, 3, 20, 14, 45, 0),
                        CompletedAt = null,
                        IsCompleted = false,
                    },
                }
            );
        }
    }
}
