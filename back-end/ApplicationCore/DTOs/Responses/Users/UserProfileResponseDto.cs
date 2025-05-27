namespace ApplicationCore.DTOs.Responses.Users
{
    public class UserProfileResponseDto
    {
        public Guid Id { get; set; }
        public string PhotoData { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? ProfessionalSkill { get; set; }
        public string? IndustryExperience { get; set; }
        public virtual List<string> TeachingApproaches { get; set; } = new List<string>();
        public virtual List<string> UserProfileAvailabilities { get; set; } = new List<string>();
        public virtual List<string> UserTopicOfstringerests { get; set; } = new List<string>();
        public virtual List<string> UserLearningStyles { get; set; } = new List<string>();
        public string? UserGoal { get; set; }
        public string SessionFrequency { get; set; } = string.Empty;
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
        public required int CommunicationMethod { get; set; }
    }
}