using ApplicationCore.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class CourseLEvelConfiguration : BaseTypeConfiguration<CourseLevel>
    {
        public override void Configure(EntityTypeBuilder<CourseLevel> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new CourseLevel { Id = 1, Name = "Beginner" },
                new CourseLevel { Id = 2, Name = "Intermediate" },
                new CourseLevel { Id = 3, Name = "Advanced" }
            );
        }
    }
}
