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
            IUnitOfWork unitOfWork)
        {

            _profileValidator = profileValidator;
            _preferenceValidator = preferenceValidator;
            _registrationRepository = registrationRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }



        public async Task<OperationResult<UserProfileResponse>> CreateProfileAsync(RegistrationProfileRequest request)
        {
            var validationResult = await _profileValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<UserProfileResponse>.BadRequest(string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }

            if (await _registrationRepository.GetByEmailAsync(request.Email) != null)
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

            int roleId = request.SelectedRole;

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = passwordHash,
                RoleId = request.SelectedRole,
                StatusId = 2
            };

            var userProfile = new UserProfile
            {
                Id = user.Id,
                FullName = request.FullName ?? string.Empty,
                Bio = request.Bio ?? string.Empty,
                ProfessionalSkill = request.SelectedRole == 3 ? request.ProfessionalSkill : request.SelectedRole == 2 ? request.ProfessionalSkill : null,
                IndustryExperience = request.SelectedRole == 3 ? request.IndustryExperience : request.SelectedRole == 2 ? request.IndustryExperience : null,
                PhotoData = photoBytes,
                PhoneNumber = request.PhoneNumber,
                UserCommunicationMethods = request.CommunicationMethod?
                .Where(cmId => cmId > 0)
                    .Select(cmId => new UserCommunicationMethod
                    {
                        UserProfileId = user.Id,
                        CommunicationMethodId = cmId
                    }).ToList() ?? new List<UserCommunicationMethod>(),
                UserProfileAvailabilities = request.Availability?.Select(a => new UserProfileAvailability
                {
                    UserId = user.Id,
                    AvailabilityId = a
                }).ToList() ?? new List<UserProfileAvailability>(),
                User = user
            };

            await _registrationRepository.AddUserAsync(user);
            await _registrationRepository.AddUserProfileAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            string Role = string.Empty;
            if (user.RoleId > 0)
            {
                var roleEntity = await _registrationRepository.GetRoleByIdAsync(user.RoleId);
                if (roleEntity != null)
                {
                    Role = roleEntity.Name;
                }
                else
                {
                    Role = "Unknown Role";
                }
            }
            var expertiseAreaNames = new List<string>();
            if (request.AreaOfExpertise != null && request.AreaOfExpertise.Any())
            {
                var expertiseIds = request.AreaOfExpertise
                                          .Where(id => id > 0)
                                          .Distinct()
                                          .ToList();
                if (expertiseIds.Any())
                {

                    var expertiseEntities = await _registrationRepository.GetAreaOfExpertisesByIdsAsync(expertiseIds);
                    expertiseAreaNames = expertiseEntities.Select(e => e.Name).ToList();
                }
            }
            var availabilityNames = new List<string>();
            if (request.Availability != null && request.Availability.Any())
            {
                var availabilityIds = request.Availability.Distinct().ToList();
                if (availabilityIds.Any())
                {
                    var availabilityEntities = await _registrationRepository.GetAvailabilitiesByIdsAsync(availabilityIds);
                    availabilityNames = availabilityEntities.Select(a => a.Name).ToList();
                }
            }
            string? communicationMethodName = null;
            List<string> communicationMethodNames = new List<string>();
            if (request.CommunicationMethod != null && request.CommunicationMethod.Any())
            {
                var validMethodIds = request.CommunicationMethod.Where(id => id > 0).Distinct().ToList();
                if (validMethodIds.Any())
                {
                    var methodEntities = await _registrationRepository.GetCommunicationMethodsByIdsAsync(validMethodIds);
                    communicationMethodNames = methodEntities.Select(m => m.Name).ToList();
                    communicationMethodName = communicationMethodNames.FirstOrDefault();
                }
            }


            var response = new UserProfileResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = userProfile.FullName,
                Role = Role,
                Bio = userProfile.Bio,
                PhotoData = userProfile.PhotoData,
                PhoneNumber = userProfile.PhoneNumber,
                ExpertiseAreas = expertiseAreaNames,
                ProfessionalSkills = userProfile.ProfessionalSkill,
                IndustryExperience = userProfile.IndustryExperience,
                Availability = availabilityNames,
                CommunicationMethod = communicationMethodNames
            };
            return OperationResult<UserProfileResponse>.Ok(response);
        }

        public async Task<OperationResult<UserPreferenceResponse>> SetUserPreferencesAsync(Guid userId, SetPreferenceRequest request)
        {
            var validationResult = await _preferenceValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<UserPreferenceResponse>.BadRequest(string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage)));
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

            if (userProfile.UserTopicOfInterests == null)
            {
                userProfile.UserTopicOfInterests = new List<UserTopicOfInterest>();
            }
            if (userProfile.UserLearningStyles == null)
            {
                userProfile.UserLearningStyles = new List<UserLearningStyle>();
            }
            if (userProfile.TeachingApproaches == null)
            {
                userProfile.TeachingApproaches = new List<MentorTeachingApproach>();
            }

            userProfile.UpdateUserProfileEntity(request, user);

            await _registrationRepository.UpdateUserProfileAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            var response = new UserPreferenceResponse
            {
                UserId = userId,
                TopicsOfInterest = userProfile.UserTopicOfInterests?.Select(t => t.TopicId).ToList() ?? new List<int>(),
                SessionFrequency = userProfile.SessionFrequencyId,
                SessionDuration = userProfile.SessionDurationId,
                LearningStyles = userProfile.UserLearningStyles?.Select(ls => ls.LearningStyleId).ToList() ?? new List<int>(),
                TeachingApproaches = userProfile.TeachingApproaches?.Select(ta => ta.TeachingApproachId).ToList() ?? new List<int>(),
                PrivacySettings = new UserPreferenceResponse.PrivacySettingsDto
                {
                    Profile = userProfile.PrivacyProfile,
                    Messages = userProfile.MessagePermission,
                    Notifications = userProfile.NotificationsEnabled
                }
            };

            return OperationResult<UserPreferenceResponse>.Ok(response);
        }
    }
}