using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Authenticates;
using ApplicationCore.DTOs.Responses.Authenticates;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Services;
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
        if(user == null)
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
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
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
        return OperationResult<MessageResponse>.Ok(new MessageResponse { Message = "Password response successfully"});
    }

    public async Task<OperationResult<TokenResponse>> RetrieveAccessToken(RefreshRequest refreshTokenRequest)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(refreshTokenRequest.AccessToken);
        var id = principal?.FindFirst("id")?.Value; 
        if(id == null)
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
