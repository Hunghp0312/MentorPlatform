using ApplicationCore.DTOs.Requests.Registration;
using Infrastructure.Entities;


namespace ApplicationCore.Extensions
{
    public static class RegistrationMappingExtension
    {
        public static User ToUserEntity(this RegistrationRequest dto, string passwordHash, int roleId)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = passwordHash,
                RoleId = roleId
            };
        }

        public static UserProfile ToUserProfileEntity(this RegistrationRequest dto, byte[]? photoData)
        {
            return new UserProfile
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName ?? string.Empty,
                Bio = dto.Bio ?? string.Empty,
                ProfessionalSkill = dto.ProfessionalSkill ?? string.Empty,
                IndustryExperience = dto.IndustryExperience ?? string.Empty,
                AvailabilityData = dto.AvailabilityData,
                UserGoal = dto.UserGoal,
                SessionFrequency = dto.SessionFrequency,
                SessionDuration = dto.SessionDuration,
                LearningStyle = dto.LearningStyle,
                TeachingApproach = dto.TeachingApproach,
                PrivacyProfile = dto.PrivacyProfile,
                MessagePermission = dto.MessagePermission,
                NotificationsEnabled = dto.NotificationsEnabled,
                CommunicationMethod = dto.CommunicationMethod,
                PhotoData = photoData
            };
        }
    }
}