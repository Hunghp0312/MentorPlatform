namespace ApplicationCore.DTOs.Responses.Authenticates;

public class TokenResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
