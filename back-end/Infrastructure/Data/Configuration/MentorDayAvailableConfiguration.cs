using Infrastructure.Data.Seeding;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorDayAvailableConfiguration : IEntityTypeConfiguration<MentorDayAvailable>
    {
        public void Configure(EntityTypeBuilder<MentorDayAvailable> builder)
        {
            builder.HasKey(me => me.Id);

            builder
                .HasOne(me => me.Mentor)
                .WithMany(ma => ma.DayAvailabilities)
                .HasForeignKey(me => me.MentorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasData(MentorDayAvailableSeeding.SeedMentorDayAvailable());
        }
    }
}
