using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Certifications;
using FluentValidation;

namespace ApplicationCore.Validators.Certifications
{
    public class CertificationDetailDtoValidator : AbstractValidator<CertificationDetailDto>
    {
        public CertificationDetailDtoValidator()
        {
            RuleFor(x => x.CertificationName)
                .NotEmpty().WithMessage(ValidationMessages.CertificationNameRequired)
                .MaximumLength(200).WithMessage(ValidationMessages.MaxLengthExceeded);

            RuleFor(x => x.IssuingOrganization)
                .NotEmpty().WithMessage(ValidationMessages.IssuingOrganizationRequired)
                .MaximumLength(200).WithMessage(ValidationMessages.MaxLengthExceeded);
        }
    }
}
