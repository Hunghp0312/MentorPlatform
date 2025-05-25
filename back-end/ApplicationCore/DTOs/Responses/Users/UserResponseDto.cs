using System;

namespace ApplicationCore.DTOs.Responses.Users
{
    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Avatar { get; set; }
        public string Role { get; set; } = null!;
        public string? Status { get; set; } // Made nullable
        public DateTime? JoinDate { get; set; } // Made nullable
        public DateTime? LastActiveDate { get; set; }
    }
}
