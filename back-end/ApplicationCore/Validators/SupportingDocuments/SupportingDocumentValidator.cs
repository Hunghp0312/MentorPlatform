using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.SupportingDocuments;
using FluentValidation;

namespace ApplicationCore.Validators.SupportingDocuments
{
    public class SupportingDocumentValidator : AbstractValidator<SupportingDocumentRequest>
    {
        public SupportingDocumentValidator()
        {
            When(x => x.file != null, () =>
            {
                RuleFor(x => x.file)
               .NotNull().WithMessage(ValidationMessages.SupportingDocumentRequired)
               .Must(file => file!.Length > 0).WithMessage("File cannot be empty.")
               .Must(file => file!.FileName.Length < 256)
                        .WithMessage(ValidationMessages.FileNameTooLong)
               .Must(file => file!.Length <= FileUploadConstants.MaxFileSizeInBytes)
                   .WithMessage(ValidationMessages.FileTooLarge.Replace("{MaxSizeInMB}", FileUploadConstants.MaxFileSizeInMB.ToString()))
               .Must(file => FileUploadConstants.AllowedFileTypes.Contains(file!.ContentType))
                   .WithMessage(ValidationMessages.InvalidFileType.Replace("{AllowedTypes}", string.Join(", ", FileUploadConstants.AllowedFileTypes)));
            });
        }
    }
}
