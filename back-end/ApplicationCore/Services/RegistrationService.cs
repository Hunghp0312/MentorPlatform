using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using ApplicationCore.Services.ServiceInterfaces;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Extensions;
using FluentValidation;
using Utilities;
using Infrastructure.Data;
using ApplicationCore.Common;
using Microsoft.AspNetCore.Http;
using Infrastructure.Entities; // Ensure this is present for UserLearningStyle and other entities
using Infrastructure.Entities.Enum; // Added for LearningStyle enum
using System.Linq;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic; // Added for List<UserLearningStyle> initialization

namespace ApplicationCore.Services
{
    public class RegistrationService : IRegistrationService
    {
        // private readonly IValidator<RegistrationRequest> _registrationValidator; // Removed
        private readonly IValidator<RegistrationProfileRequest> _profileValidator;
        private readonly IValidator<SetPreferenceRequest> _preferenceValidator;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RegistrationService(
            // IValidator<RegistrationRequest> registrationValidator, // Removed
            IValidator<RegistrationProfileRequest> profileValidator,
            IValidator<SetPreferenceRequest> preferenceValidator,
            IRegistrationRepository registrationRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            // _registrationValidator = registrationValidator; // Removed
            _profileValidator = profileValidator;
            _preferenceValidator = preferenceValidator;
            _registrationRepository = registrationRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        // Removed the first, incomplete CreateProfileAsync method

        public async Task<OperationResult<UserProfileResponse>> CreateProfileAsync(RegistrationProfileRequest request)
        {
            var validationResult = await _profileValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<UserProfileResponse>.BadRequest(string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }

            if (await _registrationRepository.GetByEmailAsync(request.Email) != null)
            {
                return OperationResult<UserProfileResponse>.Conflict("Email đã tồn tại.");
            }

            var passwordHash = SecurityHelper.HashPassword(request.Password);
            byte[]? photoBytes = null;
            if (request.PhotoData != null)
            {
                using var ms = new MemoryStream();
                await request.PhotoData.CopyToAsync(ms);
                photoBytes = ms.ToArray();
            }

            // int roleId = request.SelectedRole.Equals("Mentor", StringComparison.OrdinalIgnoreCase) ? 3 : 2; // 3 for Mentor, 2 for Learner
            int roleId = request.SelectedRole; // SelectedRole is already the ID (2 for Learner, 3 for Mentor as per validator)

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = passwordHash,
                RoleId = roleId
            };

            var userProfile = new UserProfile
            {
                Id = user.Id,
                FullName = request.FullName ?? string.Empty,
                Bio = request.Bio ?? string.Empty,
                // ProfessionalSkill = request.SelectedRole.Equals("Mentor", StringComparison.OrdinalIgnoreCase) ? request.ProfessionalSkill : null,
                // IndustryExperience = request.SelectedRole.Equals("Mentor", StringComparison.OrdinalIgnoreCase) ? request.IndustryExperience : null,
                ProfessionalSkill = request.SelectedRole == 3 ? request.ProfessionalSkill : null, // 3 is Mentor ID
                IndustryExperience = request.SelectedRole == 3 ? request.IndustryExperience : null, // 3 is Mentor ID
                PhotoData = photoBytes,
                UserGoal = request.UserGoal,
                UserProfileAvailabilities = request.Availability?.Select(id => new UserProfileAvailability { AvailabilityId = id, UserId = user.Id }).ToList() ?? new List<UserProfileAvailability>(),
                CommunicationMethod = request.CommunicationMethods?.FirstOrDefault() ?? 0
            };

            // Removed MentorExpertiseAreas assignment as the property and related entity were deleted

            await _registrationRepository.AddUserAsync(user);
            await _registrationRepository.AddUserProfileAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            var response = new UserProfileResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = userProfile.FullName,
                // Role = request.SelectedRole, // This would be an int ID
                Role = user.RoleId == 3 ? "Mentor" : (user.RoleId == 2 ? "Learner" : "Unknown"), // Map RoleId to role name
                Bio = userProfile.Bio,
                // PhotoUrl = ... // Generate if applicable
                ExpertiseAreas = new List<string>(), // ExpertiseAreas are no longer stored or returned for the profile
                ProfessionalSkills = userProfile.ProfessionalSkill,
                IndustryExperience = userProfile.IndustryExperience,
                Availability = userProfile.UserProfileAvailabilities?.Select(ua => ua.AvailabilityId).ToList() ?? new List<int>(), // Ensure Availability is initialized
                CommunicationMethods = userProfile.CommunicationMethod != 0 ? new List<int> { userProfile.CommunicationMethod } : new List<int>(), // Ensure CommunicationMethods is initialized
                UserGoals = userProfile.UserGoal
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