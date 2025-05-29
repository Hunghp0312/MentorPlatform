using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.DTOs.Responses.AreaOfExpertises;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;



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

            int currentStatusId = user.StatusId;
            int nextStatusId = -1;

            string currentStatusName = user.Status?.Name ?? $"ID ({currentStatusId})";

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

                var alreadyDeactivatedDto = MapUserToResponseDto(user);
                return OperationResult<UserResponseDto>.Ok(alreadyDeactivatedDto);
            }
            else
            {

                return OperationResult<UserResponseDto>.BadRequest($"User's current status ('{currentStatusName}') does not allow for an automatic update in the defined flow (Pending -> Active -> Deactivated).");
            }

            if (nextStatusId == -1)
            {
                return OperationResult<UserResponseDto>.BadRequest($"Cannot automatically determine next status for user with current status '{currentStatusName}'.");
            }

            user.StatusId = nextStatusId;
            await _userRepository.UpdateUserAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var updatedUser = await _userRepository.GetUserByIdAsync(userId);
            if (updatedUser == null)
            {

                return OperationResult<UserResponseDto>.Fail("Failed to retrieve user details after status update.");
            }

            var updatedUserDto = MapUserToResponseDto(updatedUser);
            return OperationResult<UserResponseDto>.Ok(updatedUserDto);
        }

        private UserResponseDto MapUserToResponseDto(User user)
        {
            if (user == null) return null!;

            return new UserResponseDto
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
            };
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
                Avatar = $"data:image/png;base64,{Convert.ToBase64String(user.UserProfile?.PhotoData ?? Array.Empty<byte>())}",
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
    }
}
