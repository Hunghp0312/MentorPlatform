using Infrastructure.Entities.Enum;
using System.Collections.Generic; // Required for ICollection
using System; // Required for Guid

namespace Infrastructure.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public byte[]? PhotoData { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? ProfessionalSkill { get; set; }
        public string? IndustryExperience { get; set; }
        public virtual ICollection<MentorTeachingApproach> TeachingApproaches { get; set; } = new List<MentorTeachingApproach>();
        public virtual ICollection<UserProfileAvailability> UserProfileAvailabilities { get; set; } = new List<UserProfileAvailability>();
        public virtual ICollection<UserTopicOfInterest> UserTopicOfInterests { get; set; } = new List<UserTopicOfInterest>();
        public virtual ICollection<UserLearningStyle> UserLearningStyles { get; set; } = new List<UserLearningStyle>(); // Ensure this line is present
        public string? UserGoal { get; set; }
        public SessionFrequency? SessionFrequency { get; set; }
        public int SessionFrequencyId { get; set; }
        public SessionDuration? SessionDuration { get; set; }
        public int SessionDurationId { get; set; }
        // public LearningStyle? LearningStyle { get; set; } // Keep commented out or remove
        // public int LearningStyleId { get; set; } // Keep commented out or remove
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
        public required int CommunicationMethod { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
