using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Authenticates;
using ApplicationCore.DTOs.Responses.Authenticates;

namespace ApplicationCore.Services.ServiceInterfaces;

public interface IAuthenticateService
{
    Task<OperationResult<TokenResponse>> LoginAsync(LoginRequest loginRequest);
    Task<OperationResult<TokenResponse>> RetrieveAccessToken(RefreshRequest refreshTokenRequest);
    Task LogoutAsync(string accessToken);
    Task<OperationResult<MessageResponse>> ForgotPasswordAsync(ForgotPasswordRequest email);
    Task<OperationResult<MessageResponse>> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest);
    Task<OperationResult<TokenResponse>> GitHubLoginAsync(string code);
}
