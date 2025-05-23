using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ApplicationCore.Services.ServiceInterfaces;

public interface ITokenService
{
    JwtSecurityToken GenerateAccessToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
