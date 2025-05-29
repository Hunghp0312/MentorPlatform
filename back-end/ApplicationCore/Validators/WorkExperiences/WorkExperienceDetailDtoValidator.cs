using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.WorkExperiences;
using FluentValidation;

namespace ApplicationCore.Validators.WorkExperience
{
    public class WorkExperienceDetailDtoValidator : AbstractValidator<WorkExperienceDetailDto>
    {
        public WorkExperienceDetailDtoValidator()
        {
            RuleFor(x => x.CompanyName)
                .NotEmpty().WithMessage(ValidationMessages.CompanyNameRequired)
                .MaximumLength(150).WithMessage(ValidationMessages.MaxLengthExceeded);

            RuleFor(x => x.Position)
                .NotEmpty().WithMessage(ValidationMessages.PositionRequired)
                .MaximumLength(150).WithMessage(ValidationMessages.MaxLengthExceeded);

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage(ValidationMessages.StartDateRequired);

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate)
                .When(x => x.EndDate.HasValue && x.StartDate != default)
                .WithMessage(ValidationMessages.EndDateAfterStartDate);

            RuleFor(x => x.StartDate)
                .Must(startDate => startDate <= DateTime.UtcNow)
                .When(x => x.StartDate != default)
                .WithMessage(ValidationMessages.StartDateEqualOrBeforeCurrentDate);
        }
    }
}
