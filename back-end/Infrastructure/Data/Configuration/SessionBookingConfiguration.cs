using Infrastructure.Data.Seeding;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class SessionBookingConfiguration : IEntityTypeConfiguration<SessionBooking>
    {
        public void Configure(EntityTypeBuilder<SessionBooking> builder)
        {
            builder.HasKey(r => r.Id);
            builder.Property(r => r.LearnerMessage).HasMaxLength(1000);

            builder
                .HasOne(sb => sb.MentorTimeAvailable)
                .WithMany(mas => mas.SessionBookings)
                .HasForeignKey(sd => sd.MentorTimeAvailableId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(sb => sb.Status)
                .WithMany()
                .HasForeignKey(sd => sd.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(sb => sb.Learner)
                .WithMany(l => l.LearnerSessions)
                .HasForeignKey(sd => sd.LearnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(sb => sb.Mentor)
                .WithMany(l => l.MentorSessions)
                .HasForeignKey(sd => sd.MentorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(sb => sb.SessionType)
                .WithMany()
                .HasForeignKey(sd => sd.SessionTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(SessionBookingSeeding.SeedSessionBookings());
        }
    }
}
