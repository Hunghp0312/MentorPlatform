using ApplicationCore.DTOs.Responses.AreaOfExpertises;
using ApplicationCore.DTOs.Responses.Users;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class UserMappingExtensions
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
        public static UserResponseDto ToUserResponseDto(this User user)
        {
            if (user == null) return null!;
            return new UserResponseDto
            {
                Id = user.Id,
                FullName = user.UserProfile?.FullName ?? string.Empty,
                Email = user.Email,
                Avatar = user.UserProfile?.PhotoData != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(user.UserProfile.PhotoData)}" : string.Empty,
                UserGoal = user.UserProfile?.UserGoal,
                Role = user.Role,
                Status = user.Status,
            };
        }
    }
}