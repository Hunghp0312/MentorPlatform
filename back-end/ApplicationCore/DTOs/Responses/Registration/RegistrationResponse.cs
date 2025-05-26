using Infrastructure.Entities;

namespace ApplicationCore.DTOs.Responses.Registration
{
    public class RegistrationResponse
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public required Role Role { get; set; }
    }
}