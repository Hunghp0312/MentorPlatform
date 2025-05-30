using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Users;
using FluentValidation;


namespace ApplicationCore.Validators.Users
{
    public class UpdateUserProfileValidator : AbstractValidator<UpdateUserProfileRequestDto>
    {
        public UpdateUserProfileValidator()
        {
            RuleFor(x => x.PhotoData)
                .Must(file => file == null || (file.Length > 0 && file.Length <= 5 * 1024 * 1024))
                .WithMessage("Larger or unsupported format: Please select a .png, .jpeg or .jpg file with a maximum of 5MB")
                .Must(file => file == null ||
                    file.ContentType == "image/png" || file.ContentType == "image/jpeg" || file.ContentType == "image/jpg")
                    .WithMessage(ValidationMessages.InvalidFileType
                        .Replace("{AllowedTypes}", "png, jpeg, jpg"));
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage(ValidationMessages.FieldRequired.Replace("{PropertyName}", "Full name"))
                .MinimumLength(2).WithMessage("Full name must be at least 2 characters long.")
                .MaximumLength(100).WithMessage(ValidationMessages.MaxLengthExceeded
                    .Replace("{PropertyName}", "Full name").Replace("{MaxLength}", "100"));

            RuleFor(x => x.Bio)
                .NotEmpty().WithMessage(ValidationMessages.FieldRequired.Replace("{PropertyName}", "Bio"))
                .MaximumLength(1000).WithMessage(ValidationMessages.MaxLengthExceeded
                    .Replace("{PropertyName}", "Bio").Replace("{MaxLength}", "500"));

            RuleFor(x => x.PhoneNumber)
                .MaximumLength(15).WithMessage(ValidationMessages.MaxLengthExceeded
                    .Replace("{PropertyName}", "Phone number").Replace("{MaxLength}", "15"))
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Invalid phone number. Please enter a valid international phone number (E.164 format).");
            RuleFor(x => x.UserAreaExpertises)
                .Must(x => x.Count != 0)
                .WithMessage("Please select at least one category from the list");
            RuleFor(x => x.ProfessionalSkill)
            .MaximumLength(50).WithMessage(ValidationMessages.MaxLengthExceeded
                .Replace("{PropertyName}", "Professional skill").Replace("{MaxLength}", "50"));
            RuleFor(x => x.IndustryExperience)
            .MaximumLength(50).WithMessage(ValidationMessages.MaxLengthExceeded
                .Replace("{PropertyName}", "Industry experience").Replace("{MaxLength}", "50"));
            RuleFor(x => x.UserProfileAvailabilities)
                .Must(x => x.Count != 0)
                .WithMessage("Please select at least one availability from the list");
            RuleFor(x => x.UserTopicOfInterests)
                .Must(x => x.Count != 0)
                .WithMessage("Please select at least one topic of interest from the list");
            RuleFor(x => x.SessionDurationId)
                .GreaterThan(0).WithMessage("Session duration is required and must be a valid option.");
            RuleFor(x => x.SessionFrequencyId)
                .GreaterThan(0).WithMessage("Session frequency is required and must be a valid option.");
            RuleFor(x => x.UserGoal)
                .MaximumLength(500).WithMessage(ValidationMessages.MaxLengthExceeded
                    .Replace("{PropertyName}", "User goal").Replace("{MaxLength}", "500"));
    
        }
    }
}