using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.Validators.Certifications;
using ApplicationCore.Validators.Educations;
using ApplicationCore.Validators.WorkExperience;
using FluentValidation;

namespace ApplicationCore.Validators.Mentors
{
    public class UpdateMentorApplicationApiRequestValidator : AbstractValidator<UpdateMyApplicationApiRequest>
    {
        public UpdateMentorApplicationApiRequestValidator()
        {
            RuleFor(x => x.EducationDetails)
                .NotNull().WithMessage(ValidationMessages.EducationDetailsRequired)
                .ForEach(educationRule =>
                {
                    educationRule.SetValidator(new EducationDetailDtoValidator());
                });

            RuleFor(x => x.WorkExperienceDetails)
                .NotNull().WithMessage(ValidationMessages.WorkExperienceDetailsRequired)
                .ForEach(experienceRule =>
                {
                    experienceRule.SetValidator(new WorkExperienceDetailDtoValidator());
                });

            RuleFor(x => x.Certifications)
                .NotNull().WithMessage(ValidationMessages.CertificationsRequired)
                .ForEach(certificationRule =>
                {
                    certificationRule.SetValidator(new CertificationDetailDtoValidator());
                });
        }
    }
}
