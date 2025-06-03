using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using FluentValidation;
using Infrastructure.Data;
using Infrastructure.Entities;
using Utilities;

namespace ApplicationCore.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IValidator<RegistrationProfileRequest> _profileValidator;
        private readonly IValidator<SetPreferenceRequest> _preferenceValidator;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RegistrationService(
            IValidator<RegistrationProfileRequest> profileValidator,
            IValidator<SetPreferenceRequest> preferenceValidator,
            IRegistrationRepository registrationRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork
        )
        {
            _profileValidator = profileValidator;
            _preferenceValidator = preferenceValidator;
            _registrationRepository = registrationRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<UserProfileResponse>> CreateProfileAsync(
            RegistrationProfileRequest request
        )
        {
            var validationResult = await _profileValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<UserProfileResponse>.BadRequest(
                    string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage))
                );
            }

            var emailCheckResult = await CheckEmailExistsAsync(request.Email);
            if (emailCheckResult.Data != null && emailCheckResult.Data.Exists)
            {
                return OperationResult<UserProfileResponse>.Conflict("Email already exists.");
            }

            var passwordHash = SecurityHelper.HashPassword(request.Password);
            byte[]? photoBytes = null;
            if (request.PhotoData != null)
            {
                using var ms = new MemoryStream();
                await request.PhotoData.CopyToAsync(ms);
                photoBytes = ms.ToArray();
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = passwordHash,
                RoleId = request.SelectedRole,
                StatusId = 2,
                UserAreaOfExpertises =
                    request
                        .AreaOfExpertise?.Where(aoeId => aoeId > 0)
                        .Select(aoeId => new UserAreaOfExpertise { AreaOfExpertiseId = aoeId })
                        .ToList() ?? new List<UserAreaOfExpertise>(),
            };

            var userProfile = new UserProfile
            {
                Id = user.Id,
                FullName = request.FullName ?? string.Empty,
                Bio = request.Bio ?? string.Empty,
                ProfessionalSkill =
                    (request.SelectedRole == 2 || request.SelectedRole == 3)
                        ? request.ProfessionalSkill
                        : null,
                IndustryExperience =
                    (request.SelectedRole == 2 || request.SelectedRole == 3)
                        ? request.IndustryExperience
                        : null,
                PhotoData = photoBytes,
                PhoneNumber = request.PhoneNumber,

                CommunicationMethodId = request.CommunicationMethod,
                UserProfileAvailabilities =
                    request
                        .Availability?.Select(a => new UserProfileAvailability
                        {
                            UserId = user.Id,
                            AvailabilityId = a,
                        })
                        .ToList() ?? new List<UserProfileAvailability>(),
                User = user,
            };

            await _registrationRepository.AddUserAsync(user);
            await _registrationRepository.AddUserProfileAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            PreferenceItemDto? roleDto = null;
            if (user.RoleId > 0)
            {
                var roleEntity = await _registrationRepository.GetRoleByIdAsync(user.RoleId);
                if (roleEntity != null)
                {
                    roleDto = new PreferenceItemDto { Id = roleEntity.Id, Name = roleEntity.Name };
                }
            }

            var expertiseAreaDtos = new List<PreferenceItemDto>();
            if (request.AreaOfExpertise != null && request.AreaOfExpertise.Any())
            {
                var expertiseIds = request.AreaOfExpertise.Where(id => id > 0).Distinct().ToList();
                if (expertiseIds.Any())
                {
                    var expertiseEntities =
                        await _registrationRepository.GetAreaOfExpertisesByIdsAsync(expertiseIds);
                    expertiseAreaDtos = expertiseEntities
                        .Select(e => new PreferenceItemDto { Id = e.Id, Name = e.Name })
                        .ToList();
                }
            }

            var availabilityDtos = new List<PreferenceItemDto>();
            if (request.Availability != null && request.Availability.Any())
            {
                var availabilityIds = request.Availability.Where(id => id > 0).Distinct().ToList();
                if (availabilityIds.Any())
                {
                    var availabilityEntities =
                        await _registrationRepository.GetAvailabilitiesByIdsAsync(availabilityIds);
                    availabilityDtos = availabilityEntities
                        .Select(a => new PreferenceItemDto { Id = a.Id, Name = a.Name })
                        .ToList();
                }
            }

            var response = new UserProfileResponse
            {
                UserId = user.Id,
                FullName = userProfile.FullName,
                Role = roleDto,
                Bio = userProfile.Bio,
                PhotoData = userProfile.PhotoData,
                PhoneNumber = userProfile.PhoneNumber,
                ExpertiseAreas = expertiseAreaDtos,
                ProfessionalSkills = userProfile.ProfessionalSkill,
                IndustryExperience = userProfile.IndustryExperience,
                Availability = availabilityDtos,
                CommunicationMethod = new PreferenceItemDto
                {
                    Id = userProfile.CommunicationMethodId,
                    Name = userProfile.CommunicationMethod?.Name ?? "Not specified",
                },
            };
            return OperationResult<UserProfileResponse>.Ok(response);
        }

        public async Task<OperationResult<UserPreferenceResponse>> SetUserPreferencesAsync(
            Guid userId,
            SetPreferenceRequest request
        )
        {
            var validationResult = await _preferenceValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<UserPreferenceResponse>.BadRequest(
                    string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage))
                );
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return OperationResult<UserPreferenceResponse>.NotFound("User not found.");
            }

            var userProfile = await _registrationRepository.GetUserProfileAsync(userId);
            if (userProfile == null)
            {
                return OperationResult<UserPreferenceResponse>.NotFound("User profile not found.");
            }

            userProfile.UserTopicOfInterests ??= new List<UserTopicOfInterest>();
            userProfile.UserLearningStyles ??= new List<UserLearningStyle>();
            userProfile.TeachingApproaches ??= new List<MentorTeachingApproach>();

            userProfile.UpdateUserProfileEntity(request, user);

            await _registrationRepository.UpdateUserProfileAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            var topicsOfInterestDtos = new List<PreferenceItemDto>();
            var topicIds =
                userProfile.UserTopicOfInterests?.Select(t => t.TopicId).Distinct().ToList()
                ?? new List<int>();
            if (topicIds.Any())
            {
                var topicEntities = await _registrationRepository.GetTopicsByIdsAsync(topicIds);
                topicsOfInterestDtos = topicEntities
                    .Select(t => new PreferenceItemDto { Id = t.Id, Name = t.Name })
                    .ToList();
            }

            var learningStylesDtos = new List<PreferenceItemDto>();
            var learningStyleIds =
                userProfile.UserLearningStyles?.Select(ls => ls.LearningStyleId).Distinct().ToList()
                ?? new List<int>();
            if (learningStyleIds.Any())
            {
                var learningStyleEntities =
                    await _registrationRepository.GetLearningStylesByIdsAsync(learningStyleIds);
                learningStylesDtos = learningStyleEntities
                    .Select(ls => new PreferenceItemDto { Id = ls.Id, Name = ls.Name })
                    .ToList();
            }

            var teachingApproachesDtos = new List<PreferenceItemDto>();
            var teachingApproachIds =
                userProfile
                    .TeachingApproaches?.Select(ta => ta.TeachingApproachId)
                    .Distinct()
                    .ToList() ?? new List<int>();
            if (teachingApproachIds.Any())
            {
                var teachingApproachEntities =
                    await _registrationRepository.GetTeachingApproachesByIdsAsync(
                        teachingApproachIds
                    );
                teachingApproachesDtos = teachingApproachEntities
                    .Select(ta => new PreferenceItemDto { Id = ta.Id, Name = ta.Name })
                    .ToList();
            }

            PreferenceItemDto? sessionFrequencyDto = null;
            if (userProfile.SessionFrequencyId.HasValue)
            {
                var frequencyEntity = await _registrationRepository.GetSessionFrequencyByIdAsync(
                    userProfile.SessionFrequencyId.Value
                );
                if (frequencyEntity != null)
                {
                    sessionFrequencyDto = new PreferenceItemDto
                    {
                        Id = frequencyEntity.Id,
                        Name = frequencyEntity.Name,
                    };
                }
            }

            PreferenceItemDto? sessionDurationDto = null;
            if (userProfile.SessionDurationId.HasValue)
            {
                var durationEntity = await _registrationRepository.GetSessionDurationByIdAsync(
                    userProfile.SessionDurationId.Value
                );
                if (durationEntity != null)
                {
                    sessionDurationDto = new PreferenceItemDto
                    {
                        Id = durationEntity.Id,
                        Name = durationEntity.Name,
                    };
                }
            }

            List<PreferenceItemDto>? finalLearningStylesDtos = null;
            if (user.RoleId == 2)
            {
                finalLearningStylesDtos = learningStylesDtos;
            }

            List<PreferenceItemDto>? finalTeachingApproachesDtos = null;
            if (user.RoleId == 3)
            {
                finalTeachingApproachesDtos = teachingApproachesDtos;
            }

            var response = new UserPreferenceResponse
            {
                UserId = userId,
                TopicsOfInterest = topicsOfInterestDtos,
                SessionFrequency = sessionFrequencyDto,
                SessionDuration = sessionDurationDto,
                LearningStyles = finalLearningStylesDtos,
                TeachingApproaches = finalTeachingApproachesDtos,
                PrivacySettings = new UserPreferenceResponse.PrivacySettingsDto
                {
                    Profile = userProfile.PrivacyProfile,
                    Messages = userProfile.MessagePermission,
                    Notifications = userProfile.NotificationsEnabled,
                },
            };

            return OperationResult<UserPreferenceResponse>.Ok(response);
        }

        public async Task<OperationResult<CheckEmailResponse>> CheckEmailExistsAsync(string email)
        {
            var existingUser = await _registrationRepository.GetByEmailAsync(email);
            if (existingUser != null)
            {
                return OperationResult<CheckEmailResponse>.Ok(
                    new CheckEmailResponse { Exists = true, Message = "Email already exists." }
                );
            }
            return OperationResult<CheckEmailResponse>.Ok(
                new CheckEmailResponse { Exists = false, Message = "Email is available." }
            );
        }
    }
}
