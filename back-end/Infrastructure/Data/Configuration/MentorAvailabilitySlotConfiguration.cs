using Infrastructure.Data.Seeding;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorAvailabilitySlotConfiguration : IEntityTypeConfiguration<MentorAvailabilitySlot>
    {
        public void Configure(EntityTypeBuilder<MentorAvailabilitySlot> builder)
        {
            builder.HasKey(me => me.Id);

            builder.HasOne(me => me.Mentor)
                .WithMany(ma => ma.CreatedAvailabilitySlots)
                .HasForeignKey(me => me.MentorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(me => me.Status)
             .WithMany()
             .HasForeignKey(me => me.StatusId)
             .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(MentorAvailabilitySlotSeeding.SeedMentorAvailabilitySlots());
        }
    }
}
