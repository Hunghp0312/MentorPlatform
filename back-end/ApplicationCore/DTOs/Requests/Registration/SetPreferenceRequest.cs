
namespace ApplicationCore.DTOs.Requests.Registration
{
    public class SetPreferenceRequest
    {
        public List<int>? TopicOfInterestIds { get; set; }
        public int? SessionFrequencyId { get; set; }
        public int? SessionDurationId { get; set; }
        public List<int>? LearningStyleIds { get; set; }
        public List<int>? TeachingApproachIds { get; set; }
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
    }
}
