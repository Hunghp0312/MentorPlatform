using System;
using System.Collections.Generic;

namespace ApplicationCore.DTOs.Responses.Registration
{
    public class UserProfileResponse
    {
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public required string Role { get; set; }
        public string? Bio { get; set; }
        public string? PhotoUrl { get; set; } // Assuming URL, adjust if byte[] or other format
        public List<string>? ExpertiseAreas { get; set; } // For Mentor
        public string? ProfessionalSkills { get; set; } // For Mentor
        public string? IndustryExperience { get; set; } // For Mentor
        public List<int>? Availability { get; set; }
        public List<int>? CommunicationMethods { get; set; }
        public string? UserGoals { get; set; }
    }
}
