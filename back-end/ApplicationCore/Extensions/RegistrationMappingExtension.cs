using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
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
                CommunicationMethod = userProfile.CommunicationMethod,
                SessionFrequency = userProfile.SessionFrequency != null ? userProfile.SessionFrequency.Name : string.Empty,
                SessionDuration = userProfile.SessionDuration != null ? userProfile.SessionDuration.Name : string.Empty,
                PrivacyProfile = userProfile.PrivacyProfile,
                MessagePermission = userProfile.MessagePermission,
                NotificationsEnabled = userProfile.NotificationsEnabled,
                TeachingApproaches = userProfile.TeachingApproaches.Select(ta => ta.TeachingApproach.Name).ToList(),
                UserProfileAvailabilities = userProfile.UserProfileAvailabilities.Select(ua => ua.Availability.Name).ToList(),
                UserTopicOfstringerests = userProfile.UserTopicOfInterests.Select(uti => uti.Topic.Name).ToList(),
                UserLearningStyles = userProfile.UserLearningStyles.Select(uls => uls.LearningStyle.Name).ToList(),
                UserGoal = userProfile.UserGoal,
                UserAreaExpertises = userProfile.User.UserArenaOfExpertises.Select(uae => uae.AreaOfExpertise.Name).ToList()
            };
        }
        public static async Task UpdateFromDtoAsync(this UserProfile userProfile, UpdateUserProfileRequestDto dto, User userEntity)
        {
            userProfile.FullName = dto.FullName ?? userProfile.FullName;
            userProfile.Bio = dto.Bio ?? userProfile.Bio;
            userProfile.PhoneNumber = dto.PhoneNumber ?? userProfile.PhoneNumber;
            userProfile.ProfessionalSkill = dto.ProfessionalSkill ?? userProfile.ProfessionalSkill;
            userProfile.IndustryExperience = dto.IndustryExperience ?? userProfile.IndustryExperience;
            userProfile.UserGoal = dto.UserGoal ?? userProfile.UserGoal;

            if (dto.PhotoData != null && dto.PhotoData.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await dto.PhotoData.CopyToAsync(ms);
                    var imageBytes = ms.ToArray();
                    userProfile.PhotoData = imageBytes;
                }
            }

            if (dto.UserProfileAvailabilities != null)
            {
                var availabilitiesToRemove = userProfile.UserProfileAvailabilities
                    .Where(a => !dto.UserProfileAvailabilities.Contains(a.AvailabilityId))
                    .ToList();

                foreach (var item in availabilitiesToRemove)
                {
                    userProfile.UserProfileAvailabilities.Remove(item);
                }

                foreach (var availabilityId in dto.UserProfileAvailabilities)
                {
                    if (!userProfile.UserProfileAvailabilities.Any(a => a.AvailabilityId == availabilityId))
                    {
                        userProfile.UserProfileAvailabilities.Add(new UserProfileAvailability
                        {
                            UserId = userProfile.Id,
                            AvailabilityId = availabilityId
                        });
                    }
                }
            }

            if (dto.UserTopicOfInterests != null)
            {
                var topicsToRemove = userProfile.UserTopicOfInterests
                    .Where(t => !dto.UserTopicOfInterests.Contains(t.TopicId))
                    .ToList();

                foreach (var item in topicsToRemove)
                {
                    userProfile.UserTopicOfInterests.Remove(item);
                }

                foreach (var topicId in dto.UserTopicOfInterests)
                {
                    if (!userProfile.UserTopicOfInterests.Any(t => t.TopicId == topicId))
                    {
                        userProfile.UserTopicOfInterests.Add(new UserTopicOfInterest
                        {
                            UserId = userProfile.Id,
                            TopicId = topicId
                        });
                    }
                }
            }

            if (dto.UserLearningStyles != null)
            {
                var stylesToRemove = userProfile.UserLearningStyles
                    .Where(s => !dto.UserLearningStyles.Contains(s.LearningStyleId))
                    .ToList();

                foreach (var item in stylesToRemove)
                {
                    userProfile.UserLearningStyles.Remove(item);
                }

                foreach (var styleId in dto.UserLearningStyles)
                {
                    if (!userProfile.UserLearningStyles.Any(s => s.LearningStyleId == styleId))
                    {
                        userProfile.UserLearningStyles.Add(new UserLearningStyle
                        {
                            UserId = userProfile.Id,
                            LearningStyleId = styleId
                        });
                    }
                }
            }

            if (dto.TeachingApproaches != null)
            {
                var approachesToRemove = userProfile.TeachingApproaches
                    .Where(a => !dto.TeachingApproaches.Contains(a.TeachingApproachId))
                    .ToList();

                foreach (var item in approachesToRemove)
                {
                    userProfile.TeachingApproaches.Remove(item);
                }

                foreach (var approachId in dto.TeachingApproaches)
                {
                    if (!userProfile.TeachingApproaches.Any(a => a.TeachingApproachId == approachId))
                    {
                        userProfile.TeachingApproaches.Add(new MentorTeachingApproach
                        {
                            UserId = userProfile.Id,
                            TeachingApproachId = approachId
                        });
                    }
                }
            }

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
            userProfile.CommunicationMethod = dto.CommunicationMethod != 0 ? dto.CommunicationMethod : userProfile.CommunicationMethod;

            if (dto.UserAreaExpertises != null)
            {
                var userAreaExpertises = userEntity.UserArenaOfExpertises.ToList() ?? new List<UserAreaOfExpertise>();
                var areasToRemove = userAreaExpertises
                    .Where(a => !dto.UserAreaExpertises.Contains(a.AreaOfExpertiseId))
                    .ToList();

                foreach (var item in areasToRemove)
                {
                    userEntity.UserArenaOfExpertises.Remove(item);
                }

                foreach (var areaId in dto.UserAreaExpertises)
                {
                    if (!userAreaExpertises.Any(a => a.AreaOfExpertiseId == areaId))
                    {
                        userEntity.UserArenaOfExpertises.Add(new UserAreaOfExpertise
                        {
                            UserId = userEntity.Id,
                            AreaOfExpertiseId = areaId
                        });
                    }
                }
            }
        }
    }
}