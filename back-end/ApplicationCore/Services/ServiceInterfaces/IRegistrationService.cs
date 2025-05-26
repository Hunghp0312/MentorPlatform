using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IRegistrationService
    {
        Task<OperationResult<UserProfileResponse>> CreateProfileAsync(RegistrationProfileRequest request);
        Task<OperationResult<UserPreferenceResponse>> SetUserPreferencesAsync(Guid userId, SetPreferenceRequest request);
    }
}