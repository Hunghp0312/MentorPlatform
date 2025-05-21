using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IRegistrationService
    {
        Task<OperationResult<RegistrationResponse>> RegisterAsync(RegistrationRequest request);
    }
}