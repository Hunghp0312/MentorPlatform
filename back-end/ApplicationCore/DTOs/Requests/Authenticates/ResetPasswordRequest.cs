namespace ApplicationCore.DTOs.Requests.Authenticates;

public class ResetPasswordRequest
{
    public required string NewPassword { get; set; }
    public required string Email { get; set; }
    public required string Token { get; set; }
}
