using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Authenticates;
using ApplicationCore.DTOs.Responses.Authenticates;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Infrastructure.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Utilities;

namespace ApplicationCore.Services;

public class AuthenticateService : IAuthenticateService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISendEmailService _sendEmailService;
    public AuthenticateService(IUserRepository userRepository, ITokenService tokenService, IUnitOfWork unitOfWork, ISendEmailService sendEmailService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
        _sendEmailService = sendEmailService;
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
        user.PasswordResetExpiry = DateTime.UtcNow.AddMinutes(30);
        await _unitOfWork.SaveChangesAsync();
        await _sendEmailService.SendEmail(
            email.Email,
            "Reset Password",
            $"<p>Click <a href='https://localhost:5173/reset-password?token={user.PasswordResetToken}&email={user.Email}'>here</a> to reset your password.</p>"
        );
        return OperationResult<MessageResponse>.Ok(new MessageResponse { Message = "Reset password email sent." });
    }

    public async Task<OperationResult<TokenResponse>> GitHubLoginAsync(string code)
    {
        // Pseudocode:
        // 1. Exchange the code for an access token from GitHub.
        // 2. Use the access token to get user info from GitHub.
        // 3. Check if a user with the GitHub email exists in the database.
        // 4. If not, create a new user with the GitHub info.
        // 5. Generate JWT access and refresh tokens.
        // 6. Save refresh token and expiry to user, save changes.
        // 7. Return tokens.

        // 1. Exchange code for access token
        using var httpClient = new HttpClient();
        var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token");
        var clientId = Environment.GetEnvironmentVariable("GITHUB_CLIENT_ID");
        var clientSecret = Environment.GetEnvironmentVariable("GITHUB_CLIENT_SECRET");
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

        // 2. Get user info from GitHub
        var userRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
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

        // If email is null, fetch from /user/emails endpoint
        if (string.IsNullOrEmpty(githubEmail))
        {
            var emailsRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user/emails");
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

        // 3. Check if user exists
        var user = await _userRepository.GetByEmailAsync(githubEmail);
        if (user == null)
        {
            // 4. Create new user
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = githubEmail,
                PasswordHash = "", // No password for OAuth users
                RoleId = 1, // Default role, adjust as needed
                LastLogin = DateTime.UtcNow
            };
            await _userRepository.AddAsync(user);
        }
        else
        {
            user.LastLogin = DateTime.UtcNow;
        }

        // 5. Generate tokens
        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? "Learner"),
        };
        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        // 6. Save changes
        await _unitOfWork.SaveChangesAsync();

        // 7. Return tokens
        var jwtHandler = new JwtSecurityTokenHandler();
        var response = new TokenResponse
        {
            AccessToken = jwtHandler.WriteToken(accessToken),
            RefreshToken = refreshToken
        };
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

        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role.Name.ToString()),
        };
        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _unitOfWork.SaveChangesAsync();
        var tokenHandler = new JwtSecurityTokenHandler();
        var loginResponse = new TokenResponse
        {
            AccessToken = tokenHandler.WriteToken(accessToken),
            RefreshToken = refreshToken,
        };
        return OperationResult<TokenResponse>.Ok(loginResponse);
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
        return OperationResult<MessageResponse>.Ok(new MessageResponse { Message = "Password response successfully" });
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
        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role.Name.ToString()),
        };
        var newAccessToken = _tokenService.GenerateAccessToken(claims);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _unitOfWork.SaveChangesAsync();
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenResponse = new TokenResponse
        {
            AccessToken = tokenHandler.WriteToken(newAccessToken),
            RefreshToken = newRefreshToken,
        };
        return OperationResult<TokenResponse>.Ok(tokenResponse);
    }

}
