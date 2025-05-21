using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class LearningStyleConfiguration : BaseTypeConfiguration<LearningStyle>
    {
        public override void Configure(EntityTypeBuilder<LearningStyle> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new LearningStyle { Id = 1, Name = "Visual" },
                new LearningStyle { Id = 2, Name = "Auditory" },
                new LearningStyle { Id = 3, Name = "Reading/Writing" },
                new LearningStyle { Id = 4, Name = "Kinesthetic" }
            );
        }
    }
}