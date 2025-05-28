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
        private readonly IUnitOfWork _unitOfWork;

        private const int StatusIdActive = 1;
        private const int StatusIdPending = 2;
        private const int StatusIdDeactivated = 3;
        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
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

        public async Task<OperationResult<UserResponseDto>> UpdateUserStatusAsync(Guid userId, UpdateUserStatusRequestDto requestDto) // requestDto hiện tại không được sử dụng cho logic nghiệp vụ
        {
            var user = await _userRepository.GetUserByIdAsync(userId); // Đảm bảo phương thức này load Status

            if (user == null)
            {
                return OperationResult<UserResponseDto>.NotFound($"User with ID {userId} not found.");
            }

            int currentStatusId = user.StatusId;
            int nextStatusId = -1; // Giá trị mặc định cho trạng thái không hợp lệ hoặc không thay đổi

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

        public Task<OperationResult<UserProfileResponseDto>> UpdateUserProfile(UpdateUserProfileRequestDto requestDto)
        {
            throw new NotImplementedException();
        }
    }
}
