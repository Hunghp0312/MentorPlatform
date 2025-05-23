using ApplicationCore.Common;
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
                UserProfileAvailabilities = dto.AvailabilityIds?.Select(id => new UserProfileAvailability { AvailabilityId = id }).ToList() ?? new List<UserProfileAvailability>(),
                TeachingApproaches = dto.TeachingApproachIds?.Select(id => new MentorTeachingApproach { TeachingApproachId = id }).ToList() ?? new List<MentorTeachingApproach>(),
                UserGoal = dto.UserGoal,
                SessionFrequencyId = dto.SessionFrequency,
                SessionDurationId = dto.SessionDuration,
                LearningStyleId = dto.LearningStyle,
                PrivacyProfile = dto.PrivacyProfile,
                MessagePermission = dto.MessagePermission,
                NotificationsEnabled = dto.NotificationsEnabled,
                CommunicationMethod = dto.CommunicationMethod,
                PhotoData = photoData
            };
        }
    }
}