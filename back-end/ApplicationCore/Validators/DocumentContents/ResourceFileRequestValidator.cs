using ApplicationCore.Common;
using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Resources;
using FluentValidation;

namespace ApplicationCore.Validators.DocumentContents
{
    internal class ResourceFileRequestValidator : AbstractValidator<ResourceFileRequest>
    {
        public ResourceFileRequestValidator()
        {
            When(x => x.file != null, () =>
            {
                RuleFor(x => x.file)
               .NotNull().WithMessage(ValidationMessages.ResourceDocumentRequired)
               .Must(file => file!.Length > 0).WithMessage("File cannot be empty.")
               .Must(file => file!.FileName.Length < 256)
                        .WithMessage(ValidationMessages.FileNameTooLong)
               .Must(file => file!.Length <= FileUploadConstants.MaxFileSizeInBytes)
                   .WithMessage(ValidationMessages.FileTooLarge.Replace("{MaxSizeInMB}", FileUploadConstants.MaxFileSizeInMB.ToString()))
               .Must(file => FileUploadConstants.AllowedFileTypes.Contains(file!.ContentType))
                   .WithMessage(ValidationMessages.InvalidFileType.Replace("{AllowedTypes}", string.Join(", ", FileUploadConstants.AllowedFileResource)));
            });
        }
    }
}
