namespace Infrastructure.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public byte[]? PhotoData { get; set; }
        public required string FullName { get; set; }
        public string? Bio { get; set; }
        public string? ProfessionalSkill { get; set; }
        public string? IndustryExperience { get; set; }
        public int? AvailabilityData { get; set; }
        public string? UserGoal { get; set; }
        public int? SessionFrequency { get; set; }
        public int? SessionDuration { get; set; }
        public int? LearningStyle { get; set; }
        public int? TeachingApproach { get; set; }
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
        public int? CommunicationMethod { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
