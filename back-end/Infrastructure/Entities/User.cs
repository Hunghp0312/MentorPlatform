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
        public virtual UserProfile? UserProfile { get; set; } // UserProfile có thể không tồn tại cho mọi User
        public virtual ICollection<UserArenaOfExpertise> UserArenaOfExpertises { get; set; } = new List<UserArenaOfExpertise>();
        public virtual ICollection<UserTopicOfInterest> UserTopicOfInterests { get; set; } = new List<UserTopicOfInterest>();
        public virtual ICollection<MentorApplication> SubmittedMentorApplications { get; set; } = new List<MentorApplication>(); // Đơn do user này nộp
        public virtual ICollection<MentorApplication> ReviewedMentorApplications { get; set; } = new List<MentorApplication>(); // Đơn do user này (admin) duyệt
        public virtual ICollection<Course> MentoredCourses { get; set; } = new List<Course>(); // Khóa học do user này làm mentor
    }
}
