using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class MentorApplicationConfiguration : IEntityTypeConfiguration<MentorApplication>
    {
        public void Configure(EntityTypeBuilder<MentorApplication> builder)
        {
            builder.HasKey(ma => ma.ApplicantId);

            builder.Property(ma => ma.ApplicationStatusId).IsRequired();

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

            builder.HasOne(ma => ma.Applicant)
                .WithOne(u => u.SubmittedMentorApplication)
                .HasForeignKey<MentorApplication>(ma => ma.ApplicantId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ma => ma.ApplicationStatus)
                .WithMany(aps => aps.MentorApplications)
                .HasForeignKey(ma => ma.ApplicationStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ma => ma.AdminReviewer)
                .WithOne(u => u.ReviewedMentorApplication)
                .HasForeignKey<MentorApplication>(ma => ma.AdminReviewerId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
