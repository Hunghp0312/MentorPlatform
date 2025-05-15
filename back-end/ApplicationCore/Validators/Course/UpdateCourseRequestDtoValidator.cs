using ApplicationCore.DTOs.Course;
using FluentValidation;

namespace ApplicationCore.Validators.Course
{
    public class UpdateCourseRequestDtoValidator : AbstractValidator<UpdateCourseRequestDto>
    {
        public UpdateCourseRequestDtoValidator()
        {
            // Title validation
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Please fill out this field")
                .MaximumLength(100)
                .WithMessage("Title should be 1 - 100 characters")
                .Must(title => !string.IsNullOrWhiteSpace(title))
                .WithMessage("Please fill out this field");

            // Category validation
            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage("Please select an item in the list")
                .NotEqual(Guid.Empty)
                .WithMessage("Please select an item in the list");

            // Status validation - optional with old value
            RuleFor(x => x.Status).IsInEnum().WithMessage("Invalid status value");

            // Difficulty validation - optional with old value
            RuleFor(x => x.Level).IsInEnum().WithMessage("Invalid difficulty value");

            // Duration validation
            RuleFor(x => x.Duration)
                .NotEmpty()
                .WithMessage("Please fill out this field")
                .MinimumLength(6)
                .WithMessage("Duration should be 6-100 characters")
                .MaximumLength(100)
                .WithMessage("Duration should be 6-100 characters")
                .Must(duration => !string.IsNullOrWhiteSpace(duration))
                .WithMessage("Please fill out this field");

            // Tags validation
            RuleForEach(x => x.Tags)
                .MaximumLength(50)
                .WithMessage("Tag should be 1-50 characters")
                .Must(tag => !string.IsNullOrWhiteSpace(tag))
                .WithMessage("Tag cannot be empty");

            // Check for duplicate tags
            RuleFor(x => x.Tags)
                .Must(tags => tags.Distinct(StringComparer.OrdinalIgnoreCase).Count() == tags.Count)
                .WithMessage("Tag already exists");

            // Description validation
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Please fill out this field")
                .MaximumLength(1000)
                .WithMessage("Description should be 1-1000 characters")
                .Must(description => !string.IsNullOrWhiteSpace(description))
                .WithMessage("Please fill out this field");
        }
    }
}
