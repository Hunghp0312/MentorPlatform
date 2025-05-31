using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Authenticates;
using ApplicationCore.DTOs.Responses.Authenticates;
using ApplicationCore.Services.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : BaseController
{
    private readonly IAuthenticateService _authService;
    private readonly IConfiguration _config;
    public AuthController(IAuthenticateService authService, IConfiguration config)
    {
        _authService = authService;
        _config = config;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(TokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return ToActionResult(result);
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await _authService.ForgotPasswordAsync(request);
        return ToActionResult(result);
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _authService.ResetPasswordAsync(request);
        return ToActionResult(result);
    }

    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(TokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshRequest request)
    {
        var result = await _authService.RetrieveAccessToken(request);
        return ToActionResult(result);
    }
    [HttpGet("github/login")]
    public IActionResult LoginWithGitHub()
    {
        var clientId = _config["GitHub:ClientId"];
        var redirectUri = _config["GitHub:RedirectUri"];
        var githubUrl = $"https://github.com/login/oauth/authorize?client_id={clientId}&redirect_uri={redirectUri}&scope=user:email";
        return Redirect(githubUrl);
    }

    [HttpGet("github/callback")]
    public async Task<IActionResult> GitHubCallback([FromQuery] string? code, [FromQuery] string? error)
    {
        var frontendUrl = _config["FrontendUrl"];
        if (!string.IsNullOrEmpty(error))
        {
            var failRedirectUrl = $"{frontendUrl}/login?oauth_error={error}";
            return Redirect(failRedirectUrl);
        }
        if (string.IsNullOrEmpty(code))
        {
            return Redirect($"{frontendUrl}/login");
        }
        var result = await _authService.GitHubLoginAsync(code);
        if (result.Data == null)
            return Redirect($"{frontendUrl}/login?oauth_error={result.Message}");

        var redirectUrl = $"{frontendUrl}/oauth-callback?accessToken={Uri.EscapeDataString(result.Data.AccessToken)}&refreshToken={Uri.EscapeDataString(result.Data.RefreshToken)}";
        return Redirect(redirectUrl);

    }

    [HttpGet("google/login")]
    public IActionResult GoogleLogin()
    {
        var clientId = _config["Google:ClientId"];
        var redirectUri = _config["Google:RedirectUri"];
        var scope = "openid profile email";
        var state = Guid.NewGuid().ToString();

        var url = $"https://accounts.google.com/o/oauth2/v2/auth" +
                  $"?response_type=code" +
                  $"&client_id={clientId}" +
                  $"&redirect_uri={redirectUri}" +
                  $"&scope={Uri.EscapeDataString(scope)}" +
                  $"&state={state}";

        return Redirect(url);
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string? code, [FromQuery] string? error)
    {
        var frontendUrl = _config["FrontendUrl"];
        if (!string.IsNullOrEmpty(error))
        {
            var failRedirectUrl = $"{frontendUrl}/login?oauth_error={error}";
            return Redirect(failRedirectUrl);
        }
        if (string.IsNullOrEmpty(code))
        {
            return Redirect($"{frontendUrl}/login");
        }

        var result = await _authService.GoogleLoginAsync(code);
        if (result.Data == null)
            return Redirect($"{frontendUrl}/login?oauth_error={result.Message}");

        var redirectUrl = $"{frontendUrl}/oauth-callback?accessToken={Uri.EscapeDataString(result.Data.AccessToken)}&refreshToken={Uri.EscapeDataString(result.Data.RefreshToken)}";
        return Redirect(redirectUrl);
    }
}