using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Educations;
using FluentValidation;

namespace ApplicationCore.Validators.Educations
{
    public class EducationDetailDtoValidator : AbstractValidator<EducationDetailDto>
    {
        public EducationDetailDtoValidator()
        {
            RuleFor(x => x.InstitutionName)
                .NotEmpty().WithMessage(ValidationMessages.InstitutionNameRequired)
                .MaximumLength(150).WithMessage(ValidationMessages.MaxLengthExceeded);

            RuleFor(x => x.FieldOfStudy)
                .NotEmpty().WithMessage(ValidationMessages.FieldOfStudyRequired)
                .MaximumLength(150).WithMessage(ValidationMessages.MaxLengthExceeded);

            RuleFor(x => x.GraduationYear)
                .InclusiveBetween(1900, DateTime.UtcNow.Year + 5).When(x => x.GraduationYear.HasValue)
                .WithMessage(ValidationMessages.GraduationYearRange);
        }
    }
}
