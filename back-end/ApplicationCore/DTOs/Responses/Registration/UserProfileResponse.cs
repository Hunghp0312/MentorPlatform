using Infrastructure.Entities;

namespace ApplicationCore.DTOs.Responses.Registration
{
    public class UserProfileResponse
    {
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public required string Role { get; set; }
        public string? Bio { get; set; }
        public byte[]? PhotoData { get; set; }
        public string? PhoneNumber { get; set; }
        public List<string>? ExpertiseAreas { get; set; }
        public List<string>? Availability { get; set; }
        public string? ProfessionalSkills { get; set; }
        public string? IndustryExperience { get; set; }
        public List<string>? CommunicationMethod { get; set; }
    }
}
