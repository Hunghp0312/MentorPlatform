using ApplicationCore.DTOs.Requests.Registration;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class RegistrationMappingExtension
    {
        public static User ToUserEntity(this RegistrationProfileRequest dto, string passwordHash, int roleId)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = passwordHash,
                RoleId = roleId
            };
        }

        public static UserProfile ToUserProfileEntity(this RegistrationProfileRequest dto, Guid userId, byte[]? photoData)
        {
            var userProfile = new UserProfile
            {
                Id = userId,
                PhotoData = photoData,
                FullName = dto.FullName ?? string.Empty,
                Bio = dto.Bio ?? string.Empty,
                PhoneNumber = dto.PhoneNumber,
                ProfessionalSkill = dto.ProfessionalSkill,
                IndustryExperience = dto.IndustryExperience,
                UserProfileAvailabilities = dto.Availability?.Select(a => new UserProfileAvailability
                {
                    UserId = userId,
                    AvailabilityId = a
                }).ToList() ?? new List<UserProfileAvailability>(),
                //CommunicationMethod = dto.CommunicationMethods?.FirstOrDefault() ?? 0,
            };

            return userProfile;
        }

        public static void UpdateUserProfileEntity(this UserProfile existingProfile, SetPreferenceRequest dto, User userEntity)
        {
            existingProfile.SessionFrequencyId = dto.SessionFrequencyId ?? existingProfile.SessionFrequencyId;
            existingProfile.SessionDurationId = dto.SessionDurationId ?? existingProfile.SessionDurationId;
            existingProfile.PrivacyProfile = dto.PrivacyProfile;
            existingProfile.MessagePermission = dto.MessagePermission;
            existingProfile.NotificationsEnabled = dto.NotificationsEnabled;

            if (dto.TopicOfInterestIds != null)
            {
                existingProfile.UserTopicOfInterests ??= new List<UserTopicOfInterest>();
                existingProfile.UserTopicOfInterests.Clear();
                foreach (var topicId in dto.TopicOfInterestIds)
                {
                    existingProfile.UserTopicOfInterests.Add(new UserTopicOfInterest { UserProfileId = existingProfile.Id, TopicId = topicId });
                }
            }

            if (userEntity.RoleId == 2)
            {
                if (dto.LearningStyleIds != null)
                {
                    existingProfile.UserLearningStyles ??= new List<UserLearningStyle>();
                    existingProfile.UserLearningStyles.Clear();
                    foreach (var styleId in dto.LearningStyleIds)
                    {
                        existingProfile.UserLearningStyles.Add(new UserLearningStyle { UserId = existingProfile.Id, LearningStyleId = styleId });
                    }
                }
            }
            else if (userEntity.RoleId == 3)
            {
                if (dto.TeachingApproachIds != null)
                {
                    existingProfile.TeachingApproaches ??= new List<MentorTeachingApproach>();
                    existingProfile.TeachingApproaches.Clear();
                    foreach (var approachId in dto.TeachingApproachIds)
                    {
                        existingProfile.TeachingApproaches.Add(new MentorTeachingApproach { UserProfileId = existingProfile.Id, TeachingApproachId = approachId });
                    }
                }
            }
        }
    }
}