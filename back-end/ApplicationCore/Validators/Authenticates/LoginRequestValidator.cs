using ApplicationCore.Constants;
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
                .WithMessage("Please fill out this field")
                .EmailAddress()
                .WithMessage("Invalid email format.");
            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage(ValidationMessages.PASSWORD_REQUIRED)
                .MinimumLength(8)
                .WithMessage(ValidationMessages.PASSWORD_MIN_LENGTH)
                .Matches("[a-zA-Z]")
                .WithMessage(ValidationMessages.PASSWORD_LETTER_REQUIRED)
                .Matches("[0-9]")
                .WithMessage(ValidationMessages.PASSWORD_DIGIT_REQUIRED)
                .Matches("[^a-zA-Z0-9]")
                .WithMessage(ValidationMessages.PASSWORD_SPECIAL_CHAR_REQUIRED);
        }
    }
}
