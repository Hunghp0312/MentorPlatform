using ApplicationCore.DTOs.Requests.Authenticates;
using FluentValidation;

namespace ApplicationCore.Validators.Authenticates
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Invalid email format.");
            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password is required.")
                .Matches(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")
                .WithMessage(
                    "Password must be at least 8 characters long and include at least one letter, one number, and one special character (@$!%*?&)."
                );
        }
    }
}
