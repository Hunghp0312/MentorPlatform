using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Registration;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class RegistrationMappingExtension
    {
        // New mapping for Step 1: Profile Creation
        public static User ToUserEntity(this RegistrationProfileRequest dto, string passwordHash, int roleId)
        {
            return new User
            {
                Id = Guid.NewGuid(), // Generate new Guid for User
                Email = dto.Email,
                PasswordHash = passwordHash,
                RoleId = roleId
            };
        }

        public static UserProfile ToUserProfileEntity(this RegistrationProfileRequest dto, Guid userId, byte[]? photoData)
        {
            var userProfile = new UserProfile
            {
                Id = userId, // Use User's Id
                FullName = dto.FullName ?? string.Empty,
                Bio = dto.Bio ?? string.Empty,
                ProfessionalSkill = dto.ProfessionalSkill, // Always map, not just for Mentor
                IndustryExperience = dto.IndustryExperience, // Always map, not just for Mentor
                UserProfileAvailabilities = dto.Availability?.Select(id => new UserProfileAvailability { UserId = userId, AvailabilityId = id }).ToList() ?? new List<UserProfileAvailability>(),
                CommunicationMethod = dto.CommunicationMethods?.FirstOrDefault() ?? 0,
                UserGoal = dto.UserGoal,
                PhotoData = photoData
            };

            return userProfile;
        }

        // New mapping/update logic for Step 2: Set Preferences (updates existing UserProfile)
        public static void UpdateUserProfileEntity(this UserProfile existingProfile, SetPreferenceRequest dto, User userEntity)
        {
            existingProfile.UserGoal = dto.UserGoal ?? existingProfile.UserGoal;
            existingProfile.SessionFrequencyId = dto.SessionFrequencyId ?? existingProfile.SessionFrequencyId;
            existingProfile.SessionDurationId = dto.SessionDurationId ?? existingProfile.SessionDurationId;
            existingProfile.PrivacyProfile = dto.PrivacyProfile;
            existingProfile.MessagePermission = dto.MessagePermission;
            existingProfile.NotificationsEnabled = dto.NotificationsEnabled;

            if (dto.TopicOfInterestIds != null)
            {
                // Ensure collection is not null
                existingProfile.UserTopicOfInterests ??= new List<UserTopicOfInterest>();
                existingProfile.UserTopicOfInterests.Clear();
                foreach (var topicId in dto.TopicOfInterestIds)
                {
                    existingProfile.UserTopicOfInterests.Add(new UserTopicOfInterest { UserId = existingProfile.Id, TopicId = topicId });
                }
            }

            if (userEntity.RoleId == 2) // Learner
            {
                if (dto.LearningStyleIds != null)
                {
                    // Ensure collection is not null
                    existingProfile.UserLearningStyles ??= new List<UserLearningStyle>();
                    existingProfile.UserLearningStyles.Clear();
                    foreach (var styleId in dto.LearningStyleIds)
                    {
                        existingProfile.UserLearningStyles.Add(new UserLearningStyle { UserId = existingProfile.Id, LearningStyleId = styleId });
                    }
                }
            }
            else if (userEntity.RoleId == 3) // Mentor
            {
                if (dto.TeachingApproachIds != null)
                {
                    // Ensure collection is not null
                    existingProfile.TeachingApproaches ??= new List<MentorTeachingApproach>();
                    existingProfile.TeachingApproaches.Clear();
                    foreach (var approachId in dto.TeachingApproachIds)
                    {
                        existingProfile.TeachingApproaches.Add(new MentorTeachingApproach { UserId = existingProfile.Id, TeachingApproachId = approachId });
                    }
                }
            }
        }
    }
}