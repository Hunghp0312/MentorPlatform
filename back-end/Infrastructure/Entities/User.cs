namespace Infrastructure.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Guid RoleId { get; set; }
        public DateTime? LastLogin { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpiry { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Navigation Properties
        public virtual Role Role { get; set; } = null!;
        public virtual UserProfile? UserProfile { get; set; }
        public virtual ICollection<UserTopicOfInterest> UserTopicOfInterests { get; set; } = new List<UserTopicOfInterest>();
        public virtual ICollection<MentorApplication> SubmittedMentorApplications { get; set; } = new List<MentorApplication>();
        public virtual ICollection<MentorApplication> ReviewedMentorApplications { get; set; } = new List<MentorApplication>();
        public virtual ICollection<Course> MentoredCourses { get; set; } = new List<Course>(); // Khóa học do user này làm mentor
    }
}
