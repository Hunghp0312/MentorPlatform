using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Users
{
    public class UpdateUserProfileRequestDto
    {
        public Guid Id { get; set; }
        public IFormFile? PhotoData { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? ProfessionalSkill { get; set; }
        public string? IndustryExperience { get; set; }
        public virtual List<int> TeachingApproaches { get; set; } = new List<int>();
        public virtual List<int> UserProfileAvailabilities { get; set; } = new List<int>();
        public virtual List<int> UserTopicOfInterests { get; set; } = new List<int>();
        public virtual List<int>? UserLearningStyles { get; set; } = new List<int>();
        public string? UserGoal { get; set; }
        public int SessionFrequencyId { get; set; }
        public int SessionDurationId { get; set; }
        public bool PrivacyProfile { get; set; } = true;
        public bool MessagePermission { get; set; } = true;
        public bool NotificationsEnabled { get; set; } = true;
        public required int CommunicationMethod { get; set; }
        public List<int> UserAreaExpertises { get; set; } = new List<int>();
        
    }
}