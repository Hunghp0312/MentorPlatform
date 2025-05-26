using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Registration
{
    public class RegistrationProfileRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public string? Bio { get; set; }
        public required int SelectedRole { get; set; }
        public IFormFile? PhotoData { get; set; }
        public List<int>? ArenaOfExpertise { get; set; }
        public required string ProfessionalSkill { get; set; }
        public required string IndustryExperience { get; set; }
        public List<int>? Availability { get; set; }
        public List<int>? CommunicationMethods { get; set; }

    }
}
