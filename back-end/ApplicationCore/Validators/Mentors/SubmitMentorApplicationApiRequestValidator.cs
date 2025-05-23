using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Mentors;
using ApplicationCore.Validators.Certifications;
using ApplicationCore.Validators.Educations;
using ApplicationCore.Validators.WorkExperience;
using FluentValidation;

namespace ApplicationCore.Validators.Mentors
{
    public class SubmitMentorApplicationApiRequestValidator : AbstractValidator<SubmitMentorApplicationApiRequest>
    {
        public SubmitMentorApplicationApiRequestValidator()
        {
            RuleFor(x => x.MotivationStatement)
                .NotEmpty().WithMessage(ValidationMessages.MotivationStatementRequired)
                .MaximumLength(1000).WithMessage(ValidationMessages.MotivationStatementMaxLength);

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
                // .NotEmpty().WithMessage(ValidationMessages.CollectionNotEmpty)
                .ForEach(certificationRule =>
                {
                    certificationRule.SetValidator(new CertificationDetailDtoValidator());
                });

            RuleFor(x => x.SupportingDocument)
               .NotNull().WithMessage(ValidationMessages.SupportingDocumentRequired)
               .Must(file => file.Length > 0).WithMessage("File cannot be empty.")
               .Must(file => file.FileName.Length < 256)
                        .WithMessage(ValidationMessages.FileNameTooLong)
               .Must(file => file.Length <= FileUploadConstants.MaxFileSizeInBytes)
                   .WithMessage(ValidationMessages.FileTooLarge.Replace("{MaxSizeInMB}", FileUploadConstants.MaxFileSizeInMB.ToString()))
               .Must(file => FileUploadConstants.AllowedFileTypes.Contains(file.ContentType))
                   .WithMessage(ValidationMessages.InvalidFileType.Replace("{AllowedTypes}", string.Join(", ", FileUploadConstants.AllowedFileTypes)));
        }
    }
}
