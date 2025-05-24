using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using System.Threading.Tasks;
using System;


namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IRegistrationService
    {

        // New method for creating user profile
        Task<OperationResult<UserProfileResponse>> CreateProfileAsync(RegistrationProfileRequest request);

        // New method for setting user preferences
        Task<OperationResult<UserPreferenceResponse>> SetUserPreferencesAsync(Guid userId, SetPreferenceRequest request);
    }
}