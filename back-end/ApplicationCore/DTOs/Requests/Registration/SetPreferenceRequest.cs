using Infrastructure.Entities;

namespace ApplicationCore.DTOs.Requests.Registration
{
    public class SetPreferenceRequest
    {
        public string? UserGoal { get; set; }
        public UserTopicOfInterest? UserTopicOfInterest { get; set; }
        public int? SessionFrequency { get; set; }
        public int? SessionDuration { get; set; }
        public int? LearningStyle { get; set; } // Dành cho Learner
        public int? TeachingApproach { get; set; } // Dành cho Mentor
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
    }
}
