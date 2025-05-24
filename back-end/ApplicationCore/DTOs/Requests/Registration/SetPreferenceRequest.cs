using System.Collections.Generic; // Added for List
using Infrastructure.Entities;

namespace ApplicationCore.DTOs.Requests.Registration
{
    public class SetPreferenceRequest
    {
        public string? UserGoal { get; set; }
        public List<int>? TopicOfInterestIds { get; set; } // Changed from UserTopicOfInterest (UserTopicOfInterest type)
        public int? SessionFrequencyId { get; set; } // Renamed for clarity to SessionFrequencyId
        public int? SessionDurationId { get; set; } // Renamed for clarity to SessionDurationId
        public List<int>? LearningStyleIds { get; set; } // Dành cho Learner, changed from int? to List<int>?
        public List<int>? TeachingApproachIds { get; set; } // Dành cho Mentor, changed from int? to List<int>?
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
    }
}
