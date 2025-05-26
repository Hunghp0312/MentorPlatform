using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.Constants;
using FluentValidation;


namespace ApplicationCore.Validators
{
    public class RegistrationProfileRequestValidator : AbstractValidator<RegistrationProfileRequest>
    {
        public RegistrationProfileRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationMessages.EMAIL_REQUIRED)
                .EmailAddress().WithMessage(ValidationMessages.EMAIL_INVALID_FORMAT);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage(ValidationMessages.PASSWORD_REQUIRED)
                .MinimumLength(8).WithMessage(ValidationMessages.PASSWORD_MIN_LENGTH)
                .Matches("[A-Z]").WithMessage(ValidationMessages.PASSWORD_UPPERCASE_REQUIRED)
                .Matches("[a-z]").WithMessage(ValidationMessages.PASSWORD_LOWERCASE_REQUIRED)
                .Matches("[0-9]").WithMessage(ValidationMessages.PASSWORD_DIGIT_REQUIRED)
                .Matches("[^a-zA-Z0-9]").WithMessage(ValidationMessages.PASSWORD_SPECIAL_CHAR_REQUIRED);

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage(ValidationMessages.CONFIRM_PASSWORD_NOT_MATCH);

            RuleFor(x => x.SelectedRole)
                .NotEmpty().WithMessage(ValidationMessages.ROLE_REQUIRED)
                .Must(roleId => roleId == 2 || roleId == 3)
                .WithMessage(ValidationMessages.ROLE_INVALID_SELECTION);

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage(ValidationMessages.FULL_NAME_REQUIRED)
                .MaximumLength(100).WithMessage(ValidationMessages.FULL_NAME_MAX_LENGTH);

            RuleFor(x => x.Bio)
                .MaximumLength(500).WithMessage(ValidationMessages.BIO_MAX_LENGTH);

            RuleFor(x => x.ArenaOfExpertise)
                .Must(areas => areas == null || !areas.Any() || areas.All(areaId => areaId > 0))
                .WithMessage(ValidationMessages.EXPERTISE_AREAS_INVALID_FORMAT);

            RuleFor(x => x.ProfessionalSkill)
                .NotEmpty().WithMessage(ValidationMessages.PROFESSIONAL_SKILL_REQUIRED)
                .MaximumLength(200).WithMessage(ValidationMessages.PROFESSIONAL_SKILL_MAX_LENGTH);

            RuleFor(x => x.IndustryExperience)
                .NotEmpty().WithMessage(ValidationMessages.INDUSTRY_EXPERIENCE_REQUIRED)
                .MaximumLength(200).WithMessage(ValidationMessages.INDUSTRY_EXPERIENCE_MAX_LENGTH);

            RuleFor(x => x.CommunicationMethods)
                .NotEmpty().WithMessage(ValidationMessages.COMMUNICATION_METHODS_REQUIRED)
                .Must(methods => methods != null && methods.Any()).WithMessage(ValidationMessages.COMMUNICATION_METHODS_AT_LEAST_ONE_REQUIRED);

            RuleFor(x => x.UserGoal)
                .NotEmpty().WithMessage(ValidationMessages.USER_GOAL_REQUIRED)
                .MaximumLength(500).WithMessage(ValidationMessages.USER_GOAL_MAX_LENGTH);
        }
    }
}
