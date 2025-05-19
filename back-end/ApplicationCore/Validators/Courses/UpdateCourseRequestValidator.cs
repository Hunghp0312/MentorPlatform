using ApplicationCore.DTOs.Requests.Courses;
using FluentValidation;

namespace ApplicationCore.Validators.Courses
{
    public class UpdateCourseRequestValidator : AbstractValidator<UpdateCourseRequest>
    {
        public UpdateCourseRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Please fill out this field")
                .MaximumLength(100)
                .WithMessage("Title should be 1 - 100 characters")
                .Must(title => !string.IsNullOrWhiteSpace(title))
                .WithMessage("Please fill out this field");

            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage("Please select an item in the list")
                .NotEqual(Guid.Empty)
                .WithMessage("Please select an item in the list");

            RuleFor(x => x.StatusId).InclusiveBetween(1, 3).WithMessage("Invalid status value");

            RuleFor(x => x.LevelId).InclusiveBetween(1, 3).WithMessage("Invalid difficulty value");

            RuleFor(x => x.Duration)
                .NotEmpty()
                .WithMessage("Please fill out this field")
                .MinimumLength(6)
                .WithMessage("Duration should be 6-100 characters")
                .MaximumLength(100)
                .WithMessage("Duration should be 6-100 characters")
                .Must(duration => !string.IsNullOrWhiteSpace(duration))
                .WithMessage("Please fill out this field");

            RuleForEach(x => x.Tags)
                .MaximumLength(50)
                .WithMessage("Tag should be 1-50 characters")
                .Must(tag => !string.IsNullOrWhiteSpace(tag))
                .WithMessage("Tag cannot be empty");

            RuleFor(x => x.Tags)
                .Must(tags => tags.Distinct(StringComparer.OrdinalIgnoreCase).Count() == tags.Count)
                .WithMessage("Tag already exists");

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
