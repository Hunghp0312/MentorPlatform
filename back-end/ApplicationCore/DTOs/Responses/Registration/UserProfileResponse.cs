using Infrastructure.Entities;

namespace ApplicationCore.DTOs.Responses.Registration
{
    public class UserProfileResponse
    {
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public PreferenceItemDto? Role { get; set; }
        public string? Bio { get; set; }
        public byte[]? PhotoData { get; set; }
        public string? PhoneNumber { get; set; }
        public List<PreferenceItemDto> ExpertiseAreas { get; set; } = new List<PreferenceItemDto>();
        public List<PreferenceItemDto> Availability { get; set; } = new List<PreferenceItemDto>();
        public string? ProfessionalSkills { get; set; }
        public string? IndustryExperience { get; set; }
        public List<PreferenceItemDto> CommunicationMethod { get; set; } = new List<PreferenceItemDto>();
    }
}
