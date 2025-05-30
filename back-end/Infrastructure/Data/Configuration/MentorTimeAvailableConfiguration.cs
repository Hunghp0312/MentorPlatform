using Infrastructure.Data.Seeding;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorTimeAvailableConfiguration : IEntityTypeConfiguration<MentorTimeAvailable>
    {
        public void Configure(EntityTypeBuilder<MentorTimeAvailable> builder)
        {
            builder.HasKey(me => me.Id);

            builder
                .HasOne(me => me.MentorDayAvailable)
                .WithMany(ma => ma.MentorTimeAvailables)
                .HasForeignKey(me => me.DayId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(me => me.Status)
                .WithMany()
                .HasForeignKey(me => me.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(MentorTimeAvailableSeeding.SeedMentorTimeAvailable());
        }
    }
}
