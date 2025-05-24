using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic; // Added for List

namespace ApplicationCore.DTOs.Requests.Registration
{
    public class RegistrationProfileRequest
    {
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

        public List<int>? AvailabilityIds { get; set; } // Changed from AvalabilityData (List<string>)

        public List<int>? CommunicationMethods { get; set; } // Changed from CommunicationMethod (int)
        public string? UserGoal { get; set; } // Added
    }
}
