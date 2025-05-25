using System.ComponentModel.DataAnnotations;

namespace ApplicationCore.DTOs.Requests.Users
{
    public class UpdateUserRoleRequestDto
    {
        [Required]
        public string Role { get; set; } = null!;
    }
}
