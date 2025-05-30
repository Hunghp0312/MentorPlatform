using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public byte[]? PhotoData { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfessionalSkill { get; set; }
        public string? IndustryExperience { get; set; }
        public virtual ICollection<MentorTeachingApproach> TeachingApproaches { get; set; } = new List<MentorTeachingApproach>();
        public virtual ICollection<UserProfileAvailability> UserProfileAvailabilities { get; set; } = new List<UserProfileAvailability>();
        public virtual ICollection<UserTopicOfInterest> UserTopicOfInterests { get; set; } = new List<UserTopicOfInterest>();
        public virtual ICollection<UserLearningStyle> UserLearningStyles { get; set; } = new List<UserLearningStyle>();
        public string? UserGoal { get; set; }
        public SessionFrequency? SessionFrequency { get; set; }
        public int? SessionFrequencyId { get; set; }
        public SessionDuration? SessionDuration { get; set; }
        public int? SessionDurationId { get; set; }
        public bool? PrivacyProfile { get; set; }
        public bool? MessagePermission { get; set; } = true;
        public bool? NotificationsEnabled { get; set; } = true;
        public virtual ICollection<UserCommunicationMethod> UserCommunicationMethods { get; set; } = new List<UserCommunicationMethod>();
        public virtual User User { get; set; } = null!;
        public TimeOnly? WorkdayStartTime { get; set; }
        public TimeOnly? WorkdayEndTime { get; set; }
    }
}
