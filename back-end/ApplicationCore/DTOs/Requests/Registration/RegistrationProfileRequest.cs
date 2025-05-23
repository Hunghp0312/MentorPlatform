using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Registration
{
    public class RegistrationProfileRequest
    {
        public static List<string>? Availability { get; internal set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
        public bool TermsAccepted { get; set; }
        public string? FullName { get; set; }
        public string? Bio { get; set; }
        public required string SelectedRole { get; set; } // "Learner" hoặc "Mentor"
        public IFormFile? PhotoData { get; set; }
        public List<int>? ArenaOfExpertise { get; set; }

        public required string ProfessionalSkill { get; set; }

        public required string IndustryExperience { get; set; }

        public List<string>? AvalabilityData { get; set; }

        public int CommunicationMethod { get; set; }
    }
}
