using Infrastructure.Entities.Enum;
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
        public virtual ICollection<MentorTeachingApproach> TeachingApproaches { get; set; } = new List<MentorTeachingApproach>();
        public virtual ICollection<UserProfileAvailability> UserProfileAvailabilities { get; set; } = new List<UserProfileAvailability>();
        public string? UserGoal { get; set; }
        public SessionFrequency? SessionFrequency { get; set; }
        public int SessionFrequencyId { get; set; }
        public SessionDuration? SessionDuration { get; set; }
        public int SessionDurationId { get; set; }
        public LearningStyle? LearningStyle { get; set; }
        public int LearningStyleId { get; set; }
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
        public int CommunicationMethod { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
