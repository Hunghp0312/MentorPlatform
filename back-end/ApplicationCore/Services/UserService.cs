// filepath: d:\CSharp\Project\back-end\ApplicationCore\Services\UserService.cs
using ApplicationCore.Common; // Added for OperationResult
using ApplicationCore.DTOs.Requests.Users;
using ApplicationCore.DTOs.Responses.Users;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Entities; // Required for User entity

namespace ApplicationCore.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        // private readonly IRoleRepository _roleRepository; // Would be needed for robust role update

        public UserService(IUserRepository userRepository /*, IRoleRepository roleRepository*/)
        {
            _userRepository = userRepository;
            // _roleRepository = roleRepository;
        }

        public async Task<OperationResult<IEnumerable<UserResponseDto>>> GetAllUsersAsync(string? roleName = null)
        {
            var users = await _userRepository.GetAllUsersAsync(); // Fetches users with their Roles included

            if (!string.IsNullOrEmpty(roleName))
            {
                users = users.Where(u => u.Role != null && u.Role.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase));
            }

            var userDtos = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                // Assuming UserProfile contains FullName and Avatar
                FullName = u.UserProfile?.FullName ?? "N/A",
                Email = u.Email,

                Role = u.Role?.Name ?? "N/A",
                // Status, JoinDate, LastActiveDate need to be mapped from User or UserProfile
                // For now, setting to null or default if direct mapping is not obvious from User entity
                Status = null, // Placeholder: Determine actual source for Status
                JoinDate = null, // Placeholder: Determine actual source for JoinDate (e.g., u.UserProfile.CreatedAt or u.CreatedAt if it exists)
                LastActiveDate = u.LastLogin // User.LastLogin seems to be the best fit for LastActiveDate
            });

            return OperationResult<IEnumerable<UserResponseDto>>.Ok(userDtos);
        }

        public async Task<OperationResult<UserResponseDto>> UpdateUserRoleAsync(Guid userId, UpdateUserRoleRequestDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId); // Fetches user with Role
            if (user == null)
            {
                return OperationResult<UserResponseDto>.Fail("User not found.");
            }

            // To properly update the role, you would typically find the Role entity by its name (request.Role)
            // and then assign its ID to user.RoleId. This requires a RoleRepository.
            // For now, this is a simplified approach and might not work if Role.Name is not directly settable
            // or if EF Core doesn't track changes to user.Role.Name for updating user.RoleId.

            // A more robust way (assuming you have an IRoleRepository):
            // var targetRole = await _roleRepository.FindByNameAsync(request.Role);
            // if (targetRole == null) {
            // return OperationResult<UserResponseDto>.Failure($"Role '{request.Role}' not found.");
            // }
            // user.RoleId = targetRole.Id;
            // user.Role = targetRole; // Optional, if EF needs the navigation property set

            // Simplified: if user.Role.Name is directly mapped to a column or can trigger update of RoleId
            if (user.Role != null && user.Role.Name != request.Role)
            {
                // This direct modification of Role.Name might not update RoleId 
                // depending on EF Core configuration and how Role entity is managed.
                // It's safer to update user.RoleId after fetching the new Role entity.
                // user.Role.Name = request.Role; // This is risky
                return OperationResult<UserResponseDto>.Fail("Role update requires changing RoleId. Direct name update not supported in this simplified version. Implement RoleRepository and update via RoleId.");
            }
            // If user.Role is null or Role.Name is already the requested role, no change or cannot change without RoleRepository

            await _userRepository.UpdateUserAsync(user); // This will save changes to the User entity itself.

            var userDto = new UserResponseDto
            {
                Id = user.Id,
                FullName = user.UserProfile?.FullName ?? "N/A",
                Email = user.Email,
                Role = user.Role?.Name ?? "N/A",
                Status = null, // Placeholder
                JoinDate = null, // Placeholder
                LastActiveDate = user.LastLogin
            };

            return OperationResult<UserResponseDto>.Ok(userDto);
        }
    }
}
