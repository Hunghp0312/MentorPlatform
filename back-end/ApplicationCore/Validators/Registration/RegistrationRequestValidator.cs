using ApplicationCore.DTOs.Requests.Registration;
using FluentValidation;
using ApplicationCore.Constants;

namespace ApplicationCore.Validators.Registration
{
    public class RegistrationRequestValidator : AbstractValidator<RegistrationRequest>
    {
        public RegistrationRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required.")
                .Length(2, 100).WithMessage("Full Name must be between 2 and 100 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage("Passwords do not match.");
        }
    }
}