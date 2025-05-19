using ApplicationCore.Entities;
using ApplicationCore.Entities.Enum;
using Infrastructure.Data.Configuration.LookupTypes;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class CourseStatusConfiguration : BaseTypeConfiguration<CourseStatus>
    {
        public override void Configure(EntityTypeBuilder<CourseStatus> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new CourseStatus { Id = 1, Name = "Draft" },
                new CourseStatus { Id = 2, Name = "Published" },
                new CourseStatus { Id = 3, Name = "Archived" }
            );
        }
    }
}
