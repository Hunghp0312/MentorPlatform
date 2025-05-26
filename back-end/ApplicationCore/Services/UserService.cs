using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;


namespace ApplicationCore.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

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

            if (!string.IsNullOrEmpty(queryParameters.Status))
            {
                if (queryParameters.Status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
                {
                    predicate = predicate.And(u => u.StatusId == 2);
                }
                else if (queryParameters.Status.Equals("Active", StringComparison.OrdinalIgnoreCase))
                {
                    predicate = predicate.And(u => u.StatusId == 1);
                }
                else if (queryParameters.Status.Equals("Deactivated", StringComparison.OrdinalIgnoreCase))
                {
                    predicate = predicate.And(u => u.StatusId == 3);
                }
            }

            if (!string.IsNullOrEmpty(queryParameters.SearchQuery))
            {
                var searchQuery = queryParameters.SearchQuery.ToLower();
                predicate = predicate.And(u =>
                    (u.UserProfile != null && u.UserProfile.FullName != null && u.UserProfile.FullName.ToLower().Contains(searchQuery)) ||
                    (u.Email != null && u.Email.ToLower().Contains(searchQuery))
                );
            }

            var (users, totalCount) = await _userRepository.GetUsersWithDetailsAsync(
                predicate,
                queryParameters.PageIndex,
                queryParameters.PageSize,
                queryParameters.OrderBy
            );

            var userResponseDtos = users.Select(user => new UserResponseDto
            {
                Id = user.Id,
                FullName = user.UserProfile?.FullName ?? string.Empty,
                Email = user.Email,
                Role = user.Role,
                Status = user.Status?.Name ?? string.Empty,
                JoinDate = user.CreatedAt,
                LastActiveDate = user.LastLogin
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
                Status = user.Status?.Name ?? string.Empty,
                JoinDate = user.CreatedAt,
                LastActiveDate = user.LastLogin
            }).ToList();
            return OperationResult<IEnumerable<UserResponseDto>>.Ok(userDtos);
        }

        public async Task<OperationResult<UserResponseDto>> UpdateUserRoleAsync(Guid userId, UpdateUserRoleRequestDto requestDto)
        {
            var user = await _userRepository.GetUserByIdsAsync(userId);
            if (user == null)
            {
                return OperationResult<UserResponseDto>.NotFound($"User with ID {userId} not found.");
            }

            if (requestDto.RoleId <= 0)
            {
                return OperationResult<UserResponseDto>.BadRequest("Invalid Role ID.");
            }

            user.RoleId = requestDto.RoleId;

            await _userRepository.UpdateUserAsync(user);
            await _unitOfWork.SaveChangesAsync();


            var updatedUser = await _userRepository.GetUserByIdsAsync(userId);
            if (updatedUser == null)
            {
                return OperationResult<UserResponseDto>.NotFound("Failed to retrieve updated user.");
            }

            var updatedUserDto = new UserResponseDto
            {
                Id = updatedUser.Id,
                FullName = updatedUser.UserProfile?.FullName ?? string.Empty,
                Email = updatedUser.Email,
                Role = updatedUser.Role,
                Status = updatedUser.Status?.Name ?? string.Empty,
                JoinDate = updatedUser.CreatedAt,
                LastActiveDate = updatedUser.LastLogin
            };

            return OperationResult<UserResponseDto>.Ok(updatedUserDto);
        }

        public async Task<OperationResult<UserResponseDto>> GetUserbyIdAsync(Guid userId)
        {
            var user = await _userRepository.GetUserByIdsAsync(userId);
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
                Status = user.Status?.Name ?? string.Empty,
                JoinDate = user.CreatedAt,
                LastActiveDate = user.LastLogin,
                IndustryExperience = user.UserProfile?.IndustryExperience,
                ProfessionalSkills = user.UserProfile?.ProfessionalSkill,
                AreaOfExpertise = user.UserArenaOfExpertises
                    .Select(a => a.AreaOfExpertise?.Name ?? string.Empty)
                    .Where(a => !string.IsNullOrEmpty(a))
                    .ToList(),
                HasMentorApplication = user.SubmittedMentorApplication != null
            };

            return OperationResult<UserResponseDto>.Ok(userResponseDto);
        }
    }
}
