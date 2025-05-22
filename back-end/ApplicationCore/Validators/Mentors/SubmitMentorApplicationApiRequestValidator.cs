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
                .MaximumLength(2000).WithMessage(ValidationMessages.MotivationStatementMaxLength);

            // 'required' keyword đảm bảo các list không null.
            // RuleFor().NotEmpty() ở đây sẽ đảm bảo list không rỗng (phải có ít nhất 1 item).
            // Nếu bạn cho phép list rỗng, hãy bỏ .NotEmpty() cho các list.
            RuleFor(x => x.EducationDetails)
                .NotNull().WithMessage(ValidationMessages.EducationDetailsRequired) // Đảm bảo list được cung cấp (dù 'required' đã làm)
                                                                                    // .NotEmpty().WithMessage(ValidationMessages.CollectionNotEmpty) // Bỏ comment nếu muốn list phải có ít nhất 1 item
                .ForEach(educationRule =>
                {
                    educationRule.SetValidator(new EducationDetailDtoValidator());
                });

            RuleFor(x => x.WorkExperienceDetails)
                .NotNull().WithMessage(ValidationMessages.WorkExperienceDetailsRequired)
                // .NotEmpty().WithMessage(ValidationMessages.CollectionNotEmpty)
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
               .Must(file => file.Length <= FileUploadConstants.MaxFileSizeInBytes)
                   .WithMessage(ValidationMessages.FileTooLarge.Replace("{MaxSizeInMB}", FileUploadConstants.MaxFileSizeInMB.ToString()))
               .Must(file => FileUploadConstants.AllowedFileTypes.Contains(file.ContentType))
                   .WithMessage(ValidationMessages.InvalidFileType.Replace("{AllowedTypes}", string.Join(", ", FileUploadConstants.AllowedFileTypes)));
        }
    }
}
