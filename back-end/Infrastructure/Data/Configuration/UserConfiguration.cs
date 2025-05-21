using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);
            builder.HasIndex(u => u.Email).IsUnique();

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(u => u.RoleId).IsRequired();

            builder.Property(u => u.PasswordResetToken)
                .IsRequired(false);

            builder.Property(u => u.PasswordResetExpiry).IsRequired(false);
            builder.Property(u => u.LastLogin).IsRequired(false);

            builder.Property(u => u.RefreshToken).IsRequired(false);
            builder.Property(u => u.RefreshTokenExpiryTime).IsRequired(false);

            builder.HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }

}
