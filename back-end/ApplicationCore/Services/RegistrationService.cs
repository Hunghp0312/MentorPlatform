using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using ApplicationCore.Services.ServiceInterfaces;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Extensions;
using FluentValidation;
using Utilities;
using Infrastructure.Data;
using ApplicationCore.Common;


namespace ApplicationCore.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IValidator<RegistrationRequest> _validator;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RegistrationService(
            IValidator<RegistrationRequest> validator,
            IRegistrationRepository registrationRepository,
            IUnitOfWork unitOfWork)
        {
            _validator = validator;
            _registrationRepository = registrationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<RegistrationResponse>> RegisterAsync(RegistrationRequest request, byte[]? photoData)
        {
            var validationResult = await _validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<RegistrationResponse>.BadRequest(
                    string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage))
                );
            }

            if (await _registrationRepository.GetByEmailAsync(request.Email) != null)
            {
                return OperationResult<RegistrationResponse>.Conflict("Email đã tồn tại.");
            }
            var passwordHash = SecurityHelper.HashPassword(request.Password);
            var user = request.ToUserEntity(passwordHash, 1);
            var userProfile = request.ToUserProfileEntity(photoData);

            await _registrationRepository.AddUserAsync(user);
            userProfile.Id = user.Id;
            await _registrationRepository.AddUserProfileAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            var response = new RegistrationResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = userProfile.FullName,
                RoleId = user.RoleId
            };

            return OperationResult<RegistrationResponse>.Ok(response);
        }
    }
}