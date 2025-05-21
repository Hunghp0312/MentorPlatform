using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.DTOs.Responses.Registration;
using ApplicationCore.Services.ServiceInterfaces;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Extensions;
using ApplicationCore.Common;
using FluentValidation;
using Utilities;
using Infrastructure.Data;

namespace ApplicationCore.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IValidator<RegistrationRequest> _validator;
        private readonly IUserRepository _userRepository;
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RegistrationService(
            IValidator<RegistrationRequest> validator,
            IUserRepository userRepository,
            IUserProfileRepository userProfileRepository,
            IUnitOfWork unitOfWork)
        {
            _validator = validator;
            _userRepository = userRepository;
            _userProfileRepository = userProfileRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<RegistrationResponse>> RegisterAsync(RegistrationRequest request)
        {
            // Validate
            var validationResult = await _validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return OperationResult<RegistrationResponse>.BadRequest(
                    string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage))
                );
            }

            // Check email tồn tại
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return OperationResult<RegistrationResponse>.Conflict("Email đã tồn tại.");
            }

            // Hash password bằng SecurityHelper
            var passwordHash = SecurityHelper.HashPassword(request.Password);

            // Mapping
            var user = request.ToUserEntity(passwordHash, 1); // 1 là RoleId cho Learner, ví dụ
            var userProfile = request.ToUserProfileEntity();

            // Lưu vào DB
            await _userRepository.AddAsync(user);
            userProfile.Id = user.Id; // Giả sử UserProfile.Id = User.Id
            await _userProfileRepository.AddAsync(userProfile);
            await _unitOfWork.SaveChangesAsync();

            // Trả về response
            var response = new RegistrationResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = userProfile.FullName,
                RoleId = new Guid(user.RoleId.ToString()) // Convert int to Guid
            };

            return OperationResult<RegistrationResponse>.Ok(response);
        }
    }
}