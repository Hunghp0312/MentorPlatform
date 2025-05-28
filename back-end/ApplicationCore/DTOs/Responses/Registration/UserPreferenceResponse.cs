namespace ApplicationCore.DTOs.Responses.Registration
{
    public class PreferenceItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
    public class UserPreferenceResponse
    {
        public Guid UserId { get; set; }
        public List<PreferenceItemDto> TopicsOfInterest { get; set; } = new List<PreferenceItemDto>();
        public PreferenceItemDto? SessionFrequency { get; set; }
        public PreferenceItemDto? SessionDuration { get; set; }
        public List<PreferenceItemDto>? LearningStyles { get; set; }
        public List<PreferenceItemDto>? TeachingApproaches { get; set; }
        public PrivacySettingsDto PrivacySettings { get; set; } = new PrivacySettingsDto();
        public class PrivacySettingsDto
        {
            public bool? Profile { get; set; }
            public bool? Messages { get; set; }
            public bool? Notifications { get; set; }
        }
    }
}
