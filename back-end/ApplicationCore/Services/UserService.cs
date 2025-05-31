using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.AreaOfExpertises;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IUnitOfWork _unitOfWork;

        private const int StatusIdActive = 1;
        private const int StatusIdPending = 2;
        private const int StatusIdDeactivated = 3;

        private const string MentorRoleName = "Mentor";
        private const string LearnerRoleName = "Learner";

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork, IUserProfileRepository userProfileRepository)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _userProfileRepository = userProfileRepository;
        }

        public async Task<OperationResult<PagedResult<UserResponseDto>>> GetUsersAsync(UserQueryParameters queryParameters)
        {
            var predicate = PredicateBuilder.True<User>();

            if (queryParameters.RoleId.HasValue)
            {
                predicate = predicate.And(u => u.RoleId == queryParameters.RoleId.Value);
            }
            if (!string.IsNullOrWhiteSpace(queryParameters.Query))
            {
                var searchTermLower = queryParameters.Query.ToLower();
                predicate = predicate.And(u => u.UserProfile != null && u.UserProfile.FullName.ToLower().Contains(searchTermLower));
            }

            var (users, totalCount) = await _userRepository.GetUsersWithDetailsAsync(
                predicate,
                queryParameters.PageIndex,
                queryParameters.PageSize
            );

            var userResponseDtos = users.Select(user => new UserResponseDto
            {
                Id = user.Id,
                Avatar = user.UserProfile?.PhotoData != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(user.UserProfile.PhotoData)}"
                    : string.Empty,
                FullName = user.UserProfile?.FullName ?? string.Empty,
                Email = user.Email,
                Role = user.Role,
                Status = user.Status,
                JoinDate = user.CreatedAt,
                LastActiveDate = user.LastLogin,
                IndustryExperience = user.UserProfile?.IndustryExperience,
                ProfessionalSkills = user.UserProfile?.ProfessionalSkill,
                AreaOfExpertise = user.UserAreaOfExpertises
                    .Select(a => new AreaOfExpertiseResponse
                    {
                        Id = a.AreaOfExpertise?.Id ?? 0,
                        Name = a.AreaOfExpertise?.Name ?? string.Empty
                    })
                    .Where(a => a.Id > 0)
                    .ToList(),
            }).ToList();

            var pagedResult = new PagedResult<UserResponseDto>
            {
                Items = userResponseDtos,
                TotalItems = totalCount,
                PageIndex = queryParameters.PageIndex,
                PageSize = queryParameters.PageSize
            };
            return OperationResult<PagedResult<UserResponseDto>>.Ok(pagedResult);
        }

        public async Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var userDtos = users.Select(user => new UserResponseDto
            {
                Id = user.Id,
                FullName = user.UserProfile?.FullName ?? string.Empty,
                Email = user.Email,
                Role = user.Role,
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
            }).ToList();
            return OperationResult<IEnumerable<UserResponseDto>>.Ok(userDtos);
        }

        public async Task<OperationResult<UserResponseDto>> UpdateUserStatusAsync(Guid userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                return OperationResult<UserResponseDto>.NotFound($"User with ID {userId} not found.");
            }
            if (user.Role == null)
            {
                return OperationResult<UserResponseDto>.Fail("User role information is not loaded. Cannot update status.");
            }

            int currentStatusId = user.StatusId;
            int nextStatusId = -1;
            string currentStatusName = user.Status?.Name ?? $"ID ({currentStatusId})";
            string userRoleName = user.Role.Name;

            if (userRoleName.Equals(LearnerRoleName, StringComparison.OrdinalIgnoreCase))
            {
                if (currentStatusId == StatusIdActive)
                {
                    nextStatusId = StatusIdDeactivated;
                }
                else if (currentStatusId == StatusIdDeactivated)
                {
                    nextStatusId = StatusIdActive;
                }
                else
                {

                    return OperationResult<UserResponseDto>.BadRequest(
                        $"Learner users can only transition between Active and Deactivated statuses. Current status: '{currentStatusName}'.");
                }
            }
            else
            {
                if (currentStatusId == StatusIdPending)
                {
                    nextStatusId = StatusIdActive;
                }
                else if (currentStatusId == StatusIdActive)
                {
                    nextStatusId = StatusIdDeactivated;
                }
                else if (currentStatusId == StatusIdDeactivated)
                {
                    nextStatusId = StatusIdActive;
                }
                else
                {
                    return OperationResult<UserResponseDto>.BadRequest($"User's current status ('{currentStatusName}') does not allow for an automatic update in the defined flow for their role ('{userRoleName}').");
                }
            }

            if (nextStatusId == -1)
            {

                return OperationResult<UserResponseDto>.BadRequest($"Cannot automatically determine next status for user with current status '{currentStatusName}' and role '{userRoleName}'. An unhandled status transition was attempted.");
            }

            if (nextStatusId == StatusIdPending)
            {
                if (!userRoleName.Equals(MentorRoleName, StringComparison.OrdinalIgnoreCase))
                {
                    return OperationResult<UserResponseDto>.BadRequest(
                        $"User status cannot be set to Pending. This operation is only allowed for users with the '{MentorRoleName}' role. This user's role is '{user.Role.Name}'.");
                }
            }

            user.StatusId = nextStatusId;

            await _userRepository.UpdateUserAsync(user);
            await _unitOfWork.CommitAsync();
            var updatedUser = await _userRepository.GetUserByIdAsync(userId);
            if (updatedUser == null)
            {

                return OperationResult<UserResponseDto>.Fail("Failed to retrieve user details after status update.");
            }
            var updatedUserDto = UserMappingExtensions.MapUserToResponseDto(updatedUser);
            return OperationResult<UserResponseDto>.Ok(updatedUserDto);
        }


        public async Task<OperationResult<UserResponseDto>> GetUserByIdAsync(Guid userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return OperationResult<UserResponseDto>.NotFound($"User with ID {userId} not found.");
            }

            var userResponseDto = new UserResponseDto
            {
                Id = user.Id,
                Avatar = user.UserProfile?.PhotoData != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(user.UserProfile.PhotoData)}"
                    : string.Empty,
                FullName = user.UserProfile?.FullName ?? string.Empty,
                Email = user.Email,
                Role = user.Role,
                Status = user.Status,
                UserGoal = user.UserProfile?.UserGoal,
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

            return OperationResult<UserResponseDto>.Ok(userResponseDto);
        }
        public async Task<OperationResult<UserProfileResponseDto>> UpdateUserProfile(Guid userProfileId, UpdateUserProfileRequestDto requestDto)
        {
            try
            {
                var userProfile = await _userProfileRepository.GetByIdAsync(userProfileId);
                if (userProfile == null)
                {
                    return OperationResult<UserProfileResponseDto>.NotFound($"User profile with ID {userProfileId} not found.");
                }

                await userProfile.UpdateFromDtoAsync(requestDto, userProfile.User);
                _userProfileRepository.Update(userProfile);
                await _unitOfWork.SaveChangesAsync();
                var updatedUserProfile = await _userProfileRepository.GetByIdAsync(userProfileId);
                if (updatedUserProfile == null)
                {
                    return OperationResult<UserProfileResponseDto>.NotFound("Failed to retrieve updated user profile.");
                }

                var res = updatedUserProfile.ToUserProfileResponseDto();

                return OperationResult<UserProfileResponseDto>.Ok(res);
            }
            catch (Exception ex)
            {
                return OperationResult<UserProfileResponseDto>.Fail($"An error occurred while updating the user profile: {ex.Message}");
            }

        }
        public async Task<OperationResult<UserFullProfileResponse>> GetFullUserProfileByIdAsync(Guid userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return OperationResult<UserFullProfileResponse>.NotFound($"User with ID {userId} not found.");
            }
            var userProfile = await _userProfileRepository.GetByIdAsync(userId);
            if (userProfile == null)
            {
                return OperationResult<UserFullProfileResponse>.NotFound($"User profile for user ID {userId} not found.");
            }
            var fullProfileResponse = new UserFullProfileResponse
            {
                Id = user.Id,
                FullName = userProfile.FullName,
                Email = user.Email,
                PhotoData = userProfile.PhotoData != null ? $"data:image/png;base64,{Convert.ToBase64String(userProfile.PhotoData)}" : string.Empty,
                UserGoal = userProfile.UserGoal,
                Bio = userProfile.Bio,
                PhoneNumber = userProfile.PhoneNumber,
                ProfessionalSkill = userProfile.ProfessionalSkill,
                IndustryExperience = userProfile.IndustryExperience,
                TeachingApproaches = userProfile.TeachingApproaches
                    .Select(ta => new EnumType { Id = ta.TeachingApproach.Id, Name = ta.TeachingApproach.Name })
                    .ToList(),
                ProfileAvailabilities = userProfile.UserProfileAvailabilities.Select(upa => new EnumType
                {
                    Id = upa.Availability.Id,
                    Name = upa.Availability.Name
                }).ToList(),
                TopicOfInterests = userProfile.UserTopicOfInterests
                    .Select(uti => new EnumType { Id = uti.Topic.Id, Name = uti.Topic.Name })
                    .ToList(),
                LearningStyles = userProfile.UserLearningStyles.Select(uls => new EnumType
                {
                    Id = uls.LearningStyle.Id,
                    Name = uls.LearningStyle.Name
                }).ToList(),
                SessionFrequency = userProfile.SessionFrequency ?? new EnumType { Id = 0, Name = "Unknown" },
                SessionDuration = userProfile.SessionDuration ?? new EnumType { Id = 0, Name = "Unknown" },
                Role = user.Role,
                PrivacyProfile = userProfile.PrivacyProfile ?? true,
                MessagePermission = userProfile.MessagePermission ?? true,
                NotificationsEnabled = userProfile.NotificationsEnabled ?? true,
                CommunicationMethod = userProfile.CommunicationMethod ?? new EnumType { Id = 0, Name = "Unknown" },
                AreaOfExpertises = user.UserAreaOfExpertises
                    .Select(uae => new EnumType { Id = uae.AreaOfExpertise.Id, Name = uae.AreaOfExpertise.Name })
                    .ToList(),

            };
            return OperationResult<UserFullProfileResponse>.Ok(fullProfileResponse);
        }
    }
}
