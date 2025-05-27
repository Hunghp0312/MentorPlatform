namespace ApplicationCore.DTOs.Responses.Registration
{
    public class UserPreferenceResponse
    {
        public Guid UserId { get; set; }
        public List<int> TopicsOfInterest { get; set; } = new List<int>();
        public int? SessionFrequency { get; set; }
        public int? SessionDuration { get; set; }
        public List<int> LearningStyles { get; set; } = new List<int>();
        public List<int> TeachingApproaches { get; set; } = new List<int>();
        public PrivacySettingsDto PrivacySettings { get; set; } = new PrivacySettingsDto();
        public class PrivacySettingsDto
        {
            public bool Profile { get; set; }
            public bool Messages { get; set; }
            public bool Notifications { get; set; }
        }
    }
}
