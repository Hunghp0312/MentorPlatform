using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class RegistrationMappingExtension
    {
        // Removed ToUserEntity extension for RegisRequest as it's no longer used.
        // User creation is now handled within CreateProfileAsync in RegistrationService.
        // Ensure RegistrationProfileRequest contains all necessary fields (Email, Password etc.)
        // or adjust CreateProfileAsync accordingly.

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
                UserCommunicationMethods = dto.CommunicationMethod?
                    .Where(cmId => cmId > 0)
                    .Select(cmId => new UserCommunicationMethod
                    {
                        UserProfileId = userId,
                        CommunicationMethodId = cmId
                    }).ToList() ?? new List<UserCommunicationMethod>()
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
        public static UserProfileResponseDto ToUserProfileResponseDto(this UserProfile userProfile)
        {
            return new UserProfileResponseDto
            {
                Id = userProfile.Id,
                FullName = userProfile.FullName,
                Bio = userProfile.Bio,
                PhoneNumber = userProfile.PhoneNumber,
                ProfessionalSkill = userProfile.ProfessionalSkill,
                IndustryExperience = userProfile.IndustryExperience,
                PhotoData = userProfile.PhotoData != null ? Convert.ToBase64String(userProfile.PhotoData) : string.Empty,
                CommunicationMethod = userProfile.UserCommunicationMethods?.Select(cm => cm.CommunicationMethod?.Name ?? string.Empty).FirstOrDefault() ?? string.Empty,
                SessionFrequency = userProfile.SessionFrequency != null ? userProfile.SessionFrequency.Name : string.Empty,
                SessionDuration = userProfile.SessionDuration != null ? userProfile.SessionDuration.Name : string.Empty,
                PrivacyProfile = userProfile.PrivacyProfile ?? false,
                MessagePermission = userProfile.MessagePermission ?? false,
                NotificationsEnabled = userProfile.NotificationsEnabled ?? false,
                TeachingApproaches = userProfile.TeachingApproaches?.Select(ta => ta.TeachingApproach?.Name ?? string.Empty).ToList() ?? new List<string>(),
                UserProfileAvailabilities = userProfile.UserProfileAvailabilities?.Select(ua => ua.Availability?.Name ?? string.Empty).ToList() ?? new List<string>(),
                UserTopicOfstringerests = userProfile.UserTopicOfInterests?.Select(uti => uti.Topic?.Name ?? string.Empty).ToList() ?? new List<string>(),
                UserLearningStyles = userProfile.UserLearningStyles?.Select(uls => uls.LearningStyle?.Name ?? string.Empty).ToList() ?? new List<string>(),
                UserGoal = userProfile.UserGoal ?? string.Empty,
                UserAreaExpertises = userProfile.User?.UserAreaOfExpertises?.Select(uae => uae.AreaOfExpertise?.Name ?? string.Empty).ToList() ?? new List<string>()
            };
        }
        public static async Task UpdateFromDtoAsync(this UserProfile userProfile, UpdateUserProfileRequestDto dto, User userEntity)
        {
            // Basic properties remain the same
            userProfile.FullName = dto.FullName ?? userProfile.FullName;
            userProfile.Bio = dto.Bio ?? userProfile.Bio;
            userProfile.PhoneNumber = dto.PhoneNumber ?? userProfile.PhoneNumber;
            userProfile.ProfessionalSkill = dto.ProfessionalSkill ?? userProfile.ProfessionalSkill;
            userProfile.IndustryExperience = dto.IndustryExperience ?? userProfile.IndustryExperience;
            userProfile.UserGoal = dto.UserGoal ?? userProfile.UserGoal;

            if (dto.PhotoData != null && dto.PhotoData.Length > 0)
            {
                await using var ms = new MemoryStream();
                await dto.PhotoData.CopyToAsync(ms);
                userProfile.PhotoData = ms.ToArray();
            }


            if (dto.UserProfileAvailabilities != null)
                UpdateUserProfileAvailabilities(userProfile, dto.UserProfileAvailabilities);

            if (dto.UserTopicOfInterests != null)
                UpdateUserTopicOfInterests(userProfile, dto.UserTopicOfInterests);

            if (dto.UserLearningStyles != null)
                UpdateUserLearningStyles(userProfile, dto.UserLearningStyles);

            if (dto.TeachingApproaches != null)
                UpdateMentorTeachingApproaches(userProfile, dto.TeachingApproaches);


            if (dto.SessionFrequencyId != 0)
            {
                userProfile.SessionFrequencyId = dto.SessionFrequencyId;
            }

            if (dto.SessionDurationId != 0)
            {
                userProfile.SessionDurationId = dto.SessionDurationId;
            }

            userProfile.PrivacyProfile = dto.PrivacyProfile;
            userProfile.MessagePermission = dto.MessagePermission;
            userProfile.NotificationsEnabled = dto.NotificationsEnabled;
            if (dto.CommunicationMethod != 0)
            {
                userProfile.UserCommunicationMethods.Clear();
                userProfile.UserCommunicationMethods.Add(new UserCommunicationMethod
                {
                    UserProfileId = userProfile.Id,
                    CommunicationMethodId = dto.CommunicationMethod
                });
            }

            if (dto.UserAreaExpertises != null)
                UpdateUserAreaExpertises(userEntity, dto.UserAreaExpertises);
        }


        private static void UpdateUserProfileAvailabilities(UserProfile userProfile, IEnumerable<int> availabilityIds)
        {
            var newIds = availabilityIds.ToList();

            // Find items to remove
            var toRemove = userProfile.UserProfileAvailabilities
                .Where(a => !newIds.Contains(a.AvailabilityId))
                .ToList();

            // Remove items
            foreach (var item in toRemove)
            {
                userProfile.UserProfileAvailabilities.Remove(item);
            }

            // Find and add new items
            foreach (var id in newIds)
            {
                if (!userProfile.UserProfileAvailabilities.Any(a => a.AvailabilityId == id))
                {
                    userProfile.UserProfileAvailabilities.Add(new UserProfileAvailability
                    {
                        UserId = userProfile.Id,
                        AvailabilityId = id
                    });
                }
            }
        }

        private static void UpdateUserTopicOfInterests(UserProfile userProfile, IEnumerable<int> topicIds)
        {
            var newIds = topicIds.ToList();

            // Find items to remove
            var toRemove = userProfile.UserTopicOfInterests
                .Where(t => !newIds.Contains(t.TopicId))
                .ToList();

            // Remove items
            foreach (var item in toRemove)
            {
                userProfile.UserTopicOfInterests.Remove(item);
            }

            // Find and add new items
            foreach (var id in newIds)
            {
                if (!userProfile.UserTopicOfInterests.Any(t => t.TopicId == id))
                {
                    userProfile.UserTopicOfInterests.Add(new UserTopicOfInterest
                    {
                        UserProfileId = userProfile.Id,
                        TopicId = id
                    });
                }
            }
        }

        private static void UpdateUserLearningStyles(UserProfile userProfile, IEnumerable<int> styleIds)
        {
            var newIds = styleIds.ToList();

            // Find items to remove
            var toRemove = userProfile.UserLearningStyles
                .Where(s => !newIds.Contains(s.LearningStyleId))
                .ToList();

            // Remove items
            foreach (var item in toRemove)
            {
                userProfile.UserLearningStyles.Remove(item);
            }

            // Find and add new items
            foreach (var id in newIds)
            {
                if (!userProfile.UserLearningStyles.Any(s => s.LearningStyleId == id))
                {
                    userProfile.UserLearningStyles.Add(new UserLearningStyle
                    {
                        UserId = userProfile.Id,
                        LearningStyleId = id
                    });
                }
            }
        }

        private static void UpdateMentorTeachingApproaches(UserProfile userProfile, IEnumerable<int> teachingApproachIds)
        {
            var newIds = teachingApproachIds.ToList();

            // Find items to remove
            var toRemove = userProfile.TeachingApproaches
                .Where(a => !newIds.Contains(a.TeachingApproachId))
                .ToList();

            // Remove items
            foreach (var item in toRemove)
            {
                userProfile.TeachingApproaches.Remove(item);
            }

            // Find and add new items
            foreach (var id in newIds)
            {
                if (!userProfile.TeachingApproaches.Any(a => a.TeachingApproachId == id))
                {
                    userProfile.TeachingApproaches.Add(new MentorTeachingApproach
                    {
                        UserProfileId = userProfile.Id,
                        TeachingApproachId = id
                    });
                }
            }
        }

        private static void UpdateUserAreaExpertises(User userEntity, IEnumerable<int> areaExpertiseIds)
        {
            var newIds = areaExpertiseIds.ToList();

            // Find items to remove
            var toRemove = userEntity.UserAreaOfExpertises
                .Where(a => !newIds.Contains(a.AreaOfExpertiseId))
                .ToList();

            // Remove items
            foreach (var item in toRemove)
            {
                userEntity.UserAreaOfExpertises.Remove(item);
            }

            // Find and add new items
            foreach (var id in newIds)
            {
                if (!userEntity.UserAreaOfExpertises.Any(a => a.AreaOfExpertiseId == id))
                {
                    userEntity.UserAreaOfExpertises.Add(new UserAreaOfExpertise
                    {
                        UserId = userEntity.Id,
                        AreaOfExpertiseId = id
                    });
                }
            }
        }

    }
}