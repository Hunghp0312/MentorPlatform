using Infrastructure.Entities;
using Infrastructure.Entities.Enum;
using ApplicationCore.DTOs.Responses.AreaOfExpertises;

namespace ApplicationCore.DTOs.Responses.Users
{

    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Avatar { get; set; }
        public string? UserGoal { get; set; }
        public Role Role { get; set; } = null!;
        public UserStatus Status { get; set; } = null!;
        public DateTime? JoinDate { get; set; }
        public DateTime? LastActiveDate { get; set; }
        public string? IndustryExperience { get; set; }
        public string? ProfessionalSkills { get; set; }
        public List<AreaOfExpertiseResponse> AreaOfExpertise { get; set; } = null!;
        public bool HasMentorApplication { get; set; }
    }
}
