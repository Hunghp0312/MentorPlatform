using ApplicationCore.DTOs.Responses.AreaOfExpertises;
using ApplicationCore.DTOs.Responses.Users;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public class UserMappingExtensions
    {
        public static UserResponseDto MapUserToResponseDto(User user)
        {
            if (user == null) return null!;

            return new UserResponseDto
            {
                Id = user.Id,
                FullName = user.UserProfile?.FullName ?? string.Empty,
                Email = user.Email,
                Role = user.Role,
                UserGoal = user.UserProfile?.UserGoal,
                Status = user.Status,
                JoinDate = user.CreatedAt,
                LastActiveDate = user.LastLogin,
                IndustryExperience = user.UserProfile?.IndustryExperience,
                ProfessionalSkills = user.UserProfile?.ProfessionalSkill,
                AreaOfExpertise = user.UserAreaOfExpertises
                    .Where(uae => uae.AreaOfExpertise != null)
                    .Select(uae => new AreaOfExpertiseResponse
                    {
                        Id = uae.AreaOfExpertise!.Id,
                        Name = uae.AreaOfExpertise!.Name ?? string.Empty
                    })
                    .ToList(),
                HasMentorApplication = user.SubmittedMentorApplication != null
            };
        }
    }
}