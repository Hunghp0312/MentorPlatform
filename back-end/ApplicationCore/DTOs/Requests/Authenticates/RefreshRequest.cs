namespace ApplicationCore.DTOs.Requests.Authenticates;

public class RefreshRequest
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
