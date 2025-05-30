using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Authenticates;
using ApplicationCore.DTOs.Responses.Authenticates;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Utilities;
namespace ApplicationCore.Services;

public class AuthenticateService : IAuthenticateService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISendEmailService _sendEmailService;
    private readonly IConfiguration _configuration;
    public AuthenticateService(IUserRepository userRepository, ITokenService tokenService, IUnitOfWork unitOfWork, ISendEmailService sendEmailService, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
        _sendEmailService = sendEmailService;
        _configuration = configuration;
    }

    public async Task<OperationResult<MessageResponse>> ForgotPasswordAsync(ForgotPasswordRequest email)
    {
        var user = await _userRepository.GetByEmailAsync(email.Email);
        if (user == null)
        {
            return OperationResult<MessageResponse>.BadRequest("User not found.");
        }
        var tokenResetPassword = _tokenService.GenerateRefreshToken();
        user.PasswordResetToken = tokenResetPassword;
        user.PasswordResetExpiry = DateTime.UtcNow.AddMinutes(5);
        var encodedPasswordResetToken = Uri.EscapeDataString(user.PasswordResetToken);
        var encodedEmail = Uri.EscapeDataString(user.Email);
        var frontendUrl = _configuration["FrontendUrl"];
        await _unitOfWork.SaveChangesAsync();
        await _sendEmailService.SendEmail(
            email.Email,
            "Reset Password",
            $"<p>Click <a href='{frontendUrl}/reset-password?token={encodedPasswordResetToken}&email={encodedEmail}'>here</a> to reset your password.</p>"
        );
        return OperationResult<MessageResponse>.Ok(new MessageResponse { Message = "Reset password email sent." });
    }

    public async Task<OperationResult<TokenResponse>> GitHubLoginAsync(string code)
    {
        using var httpClient = new HttpClient();
        var githubAccessTokenLink = "https://github.com/login/oauth/access_token";
        var tokenRequest = new HttpRequestMessage(HttpMethod.Post, githubAccessTokenLink);
        var clientId = _configuration["Github:ClientId"];
        var clientSecret = _configuration["Github:ClientSecret"];
        tokenRequest.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "client_id", clientId ?? "" },
            { "client_secret", clientSecret ?? "" },
            { "code", code }
        });
        tokenRequest.Headers.Add("Accept", "application/json");
        var tokenResponse = await httpClient.SendAsync(tokenRequest);
        if (!tokenResponse.IsSuccessStatusCode)
            return OperationResult<TokenResponse>.BadRequest("Failed to get GitHub access token.");
        var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
        var tokenObj = System.Text.Json.JsonDocument.Parse(tokenJson).RootElement;
        var githubAccessToken = tokenObj.GetProperty("access_token").GetString();
        if (string.IsNullOrEmpty(githubAccessToken))
            return OperationResult<TokenResponse>.BadRequest("GitHub access token missing.");

        var githubUserLink = "https://api.github.com/user";
        var userRequest = new HttpRequestMessage(HttpMethod.Get, githubUserLink);
        userRequest.Headers.Add("Authorization", $"Bearer {githubAccessToken}");
        userRequest.Headers.Add("User-Agent", "YourAppName");
        var userResponse = await httpClient.SendAsync(userRequest);
        if (!userResponse.IsSuccessStatusCode)
            return OperationResult<TokenResponse>.BadRequest("Failed to get GitHub user info.");
        var userJson = await userResponse.Content.ReadAsStringAsync();
        var userObj = System.Text.Json.JsonDocument.Parse(userJson).RootElement;
        var githubEmail = userObj.TryGetProperty("email", out var emailProp) && emailProp.ValueKind == System.Text.Json.JsonValueKind.String
            ? emailProp.GetString()
            : null;

        if (string.IsNullOrEmpty(githubEmail))
        {
            var githubEmailLink = "https://api.github.com/user/emails";
            var emailsRequest = new HttpRequestMessage(HttpMethod.Get, githubEmailLink);
            emailsRequest.Headers.Add("Authorization", $"Bearer {githubAccessToken}");
            emailsRequest.Headers.Add("User-Agent", "YourAppName");
            var emailsResponse = await httpClient.SendAsync(emailsRequest);
            if (emailsResponse.IsSuccessStatusCode)
            {
                var emailsJson = await emailsResponse.Content.ReadAsStringAsync();
                var emailsArr = System.Text.Json.JsonDocument.Parse(emailsJson).RootElement;
                foreach (var emailEntry in emailsArr.EnumerateArray())
                {
                    if (emailEntry.TryGetProperty("primary", out var primaryProp) && primaryProp.GetBoolean())
                    {
                        githubEmail = emailEntry.GetProperty("email").GetString();
                        break;
                    }
                }
            }
        }

        if (string.IsNullOrEmpty(githubEmail))
            return OperationResult<TokenResponse>.BadRequest("GitHub email not found.");

        var user = await _userRepository.GetByEmailAsync(githubEmail);
        if (user == null)
        {
            // Initialize avatarBytes to an empty byte array to avoid CS0165 error
            byte[] avatarBytes = Array.Empty<byte>();
            var avatarUrl = userObj.GetProperty("avatar_url").GetString() ?? "";
            if (!string.IsNullOrEmpty(avatarUrl))
            {
                try
                {
                    using var avatarResponse = await httpClient.GetAsync(avatarUrl);
                    avatarResponse.EnsureSuccessStatusCode();
                    avatarBytes = await avatarResponse.Content.ReadAsByteArrayAsync();
                }
                catch
                {
                    avatarBytes = Array.Empty<byte>();
                }
            }
            var githubName = userObj.GetProperty("name").GetString() ?? userObj.GetProperty("login").GetString() ?? "Github User";
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = githubEmail,
                PasswordHash = "",
                RoleId = 2,
                LastLogin = DateTime.UtcNow,
                StatusId = 1,
                UserProfile = new UserProfile
                {
                    FullName = githubName,
                    PhotoData = avatarBytes
                }
            };
            await _userRepository.AddAsync(user);
        }
        else
        {
            user.LastLogin = DateTime.UtcNow;
        }

        var response = await GenerateTokensForUser(user);
        return OperationResult<TokenResponse>.Ok(response);
    }
    public async Task<OperationResult<TokenResponse>> GoogleLoginAsync(string code)
    {
        var googleAccessTokenLink = "https://oauth2.googleapis.com/token";
        using var httpClient = new HttpClient();
        var clientId = _configuration["Google:ClientId"];
        var clientSecret = _configuration["Google:ClientSecret"];
        var redirectUri = _configuration["Google:RedirectUri"];
        var tokenRequest = new HttpRequestMessage(HttpMethod.Post, googleAccessTokenLink)
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "code", code },
            { "client_id", clientId ?? "" },
            { "client_secret", clientSecret ?? "" },
            { "redirect_uri", redirectUri ?? "" },
            { "grant_type", "authorization_code" }
        })
        };
        var tokenResponse = await httpClient.SendAsync(tokenRequest);
        if (!tokenResponse.IsSuccessStatusCode)
            return OperationResult<TokenResponse>.BadRequest("Failed to get Google access token.");
        var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
        var tokenObj = System.Text.Json.JsonDocument.Parse(tokenJson).RootElement;
        var googleAccessToken = tokenObj.GetProperty("access_token").GetString();
        if (string.IsNullOrEmpty(googleAccessToken))
            return OperationResult<TokenResponse>.BadRequest("Google access token missing.");


        var gooogleInfoLink = "https://www.googleapis.com/oauth2/v2/userinfo";
        var userRequest = new HttpRequestMessage(HttpMethod.Get, gooogleInfoLink);
        userRequest.Headers.Add("Authorization", $"Bearer {googleAccessToken}");
        var userResponse = await httpClient.SendAsync(userRequest);
        if (!userResponse.IsSuccessStatusCode)
            return OperationResult<TokenResponse>.BadRequest("Failed to get Google user info.");
        var userJson = await userResponse.Content.ReadAsStringAsync();
        var userObj = System.Text.Json.JsonDocument.Parse(userJson).RootElement;
        var googleEmail = userObj.GetProperty("email").GetString();
        if (string.IsNullOrEmpty(googleEmail))
            return OperationResult<TokenResponse>.BadRequest("Google email not found.");
        // Get the profile picture URL


        var user = await _userRepository.GetByEmailAsync(googleEmail);
        if (user == null)
        {
            var pictureUrl = userObj.TryGetProperty("picture", out var pictureProp) && pictureProp.ValueKind == System.Text.Json.JsonValueKind.String
            ? pictureProp.GetString()
            : null;

            // Download the profile image if available
            byte[] avatarBytes = Array.Empty<byte>();
            if (!string.IsNullOrEmpty(pictureUrl))
            {
                try
                {
                    using var avatarResponse = await httpClient.GetAsync(pictureUrl);
                    avatarResponse.EnsureSuccessStatusCode();
                    avatarBytes = await avatarResponse.Content.ReadAsByteArrayAsync();
                }
                catch
                {
                    avatarBytes = Array.Empty<byte>();
                }
            }
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = googleEmail,
                PasswordHash = "",
                RoleId = 2,
                LastLogin = DateTime.UtcNow,
                StatusId = 1,
                UserProfile = new UserProfile
                {
                    FullName = userObj.GetProperty("name").GetString() ?? "Google User",
                    PhotoData = avatarBytes
                }
            };
            await _userRepository.AddAsync(user);
        }
        else
        {
            user.LastLogin = DateTime.UtcNow;
        }
        var response = await GenerateTokensForUser(user);
        return OperationResult<TokenResponse>.Ok(response);
    }
    public async Task<OperationResult<TokenResponse>> LoginAsync(LoginRequest loginRequest)
    {
        var user = await _userRepository.GetByEmailAsync(loginRequest.Email);
        if (user == null)
        {
            return OperationResult<TokenResponse>.BadRequest("User not found.");
        }
        if (!SecurityHelper.VerifyPassword(loginRequest.Password, user.PasswordHash))
        {
            return OperationResult<TokenResponse>.BadRequest("Password is incorrect");
        }
        if (user.StatusId == 3)
        {
            return OperationResult<TokenResponse>.BadRequest("Your account is deactivated. Please contact support.");
        }
        var tokenResponse = await GenerateTokensForUser(user);
        return OperationResult<TokenResponse>.Ok(tokenResponse);
    }

    public Task LogoutAsync(string accessToken)
    {
        throw new NotImplementedException();
    }

    public async Task<OperationResult<MessageResponse>> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest)
    {
        var user = await _userRepository.GetByEmailAsync(resetPasswordRequest.Email);
        if (user == null)
        {
            return OperationResult<MessageResponse>.BadRequest("User with email not found");
        }
        if (user.PasswordResetToken != resetPasswordRequest.Token || user.PasswordResetExpiry < DateTime.UtcNow)
        {
            return OperationResult<MessageResponse>.BadRequest("Token is expired");
        }
        var newPasswordHash = SecurityHelper.HashPassword(resetPasswordRequest.NewPassword);
        user.PasswordHash = newPasswordHash;
        user.PasswordResetToken = null;
        user.PasswordResetExpiry = null;
        await _unitOfWork.SaveChangesAsync();
        return OperationResult<MessageResponse>.Ok(new MessageResponse { Message = "Password change successfully" });
    }

    public async Task<OperationResult<TokenResponse>> RetrieveAccessToken(RefreshRequest refreshTokenRequest)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(refreshTokenRequest.AccessToken);
        var id = principal?.FindFirst("id")?.Value;
        if (id == null)
        {
            return OperationResult<TokenResponse>.BadRequest("Invalid token.");
        }
        var user = await _userRepository.GetByIdAsync(Guid.Parse(id));
        if (user == null)
        {
            return OperationResult<TokenResponse>.BadRequest("User not found.");
        }
        if (user.RefreshToken != refreshTokenRequest.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return OperationResult<TokenResponse>.BadRequest("Invalid refresh token.");
        }
        if (user.StatusId == 3)
        {
            return OperationResult<TokenResponse>.BadRequest("Your account is deactivated. Please contact support.");
        }
        var tokenResponse = await GenerateTokensForUser(user);
        return OperationResult<TokenResponse>.Ok(tokenResponse);
    }

    private async Task<TokenResponse> GenerateTokensForUser(User user)
    {
        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? "Learner"),
            new Claim("isActive", user.StatusId.ToString())
        };

        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.LastLogin = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        var tokenHandler = new JwtSecurityTokenHandler();
        return new TokenResponse
        {
            AccessToken = tokenHandler.WriteToken(accessToken),
            RefreshToken = refreshToken
        };
    }

}
