using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public virtual Role Role { get; set; } = null!;
        public DateTime? LastLogin { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpiry { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public int StatusId { get; set; }
        public virtual UserStatus Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual UserProfile UserProfile { get; set; } = default!;
        public virtual MentorApplication SubmittedMentorApplication { get; set; } = null!;
        public virtual MentorApplication ReviewedMentorApplication { get; set; } = null!;
        public virtual ICollection<Course> MentoredCourses { get; set; } = new List<Course>();
        public virtual ICollection<UserAreaOfExpertise> UserArenaOfExpertises { get; set; } = new List<UserAreaOfExpertise>();
    }
}
