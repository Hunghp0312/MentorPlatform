using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorApplicationConfiguration : IEntityTypeConfiguration<MentorApplication>
    {
        public void Configure(EntityTypeBuilder<MentorApplication> builder)
        {
            builder.HasKey(ma => ma.Id);

            builder.Property(ma => ma.ApplicantId).IsRequired();
            builder.Property(ma => ma.ApplicationStatusId).IsRequired();
            builder.Property(ma => ma.MotivationStatement).IsRequired();

            builder.Property(ma => ma.SubmissionDate)
                .IsRequired();

            builder.Property(ma => ma.LastStatusUpdateDate).IsRequired(false);
            builder.Property(ma => ma.AdminReviewerId).IsRequired(false);
            builder.Property(ma => ma.AdminComments).IsRequired(false);
            builder.Property(ma => ma.RejectionReason).IsRequired(false);
            builder.Property(ma => ma.ApprovalDate).IsRequired(false);

            builder.Property(ma => ma.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");
            builder.Property(ma => ma.UpdatedAt).IsRequired(false);

            // Relationships
            builder.HasOne(ma => ma.Applicant)
                .WithMany(u => u.SubmittedMentorApplications)
                .HasForeignKey(ma => ma.ApplicantId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ma => ma.ApplicationStatus)
                .WithMany(aps => aps.MentorApplications)
                .HasForeignKey(ma => ma.ApplicationStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ma => ma.AdminReviewer)
                .WithMany(u => u.ReviewedMentorApplications)
                .HasForeignKey(ma => ma.AdminReviewerId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
