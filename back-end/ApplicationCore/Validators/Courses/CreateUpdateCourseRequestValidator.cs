using ApplicationCore.DTOs.Requests.Courses;
using FluentValidation;
using ApplicationCore.Constants;

namespace ApplicationCore.Validators.Courses
{
    public class CreateUpdateCourseRequestValidator : AbstractValidator<CreateUpdateCourseRequest>
    {
        public CreateUpdateCourseRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage(ValidationMessages.CourseTitleRequired)
                .MaximumLength(100)
                .WithMessage(ValidationMessages.CourseTitleMaxLength)
                .Must(name => !string.IsNullOrWhiteSpace(name))
                .WithMessage(ValidationMessages.CourseTitleRequired);

            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage(ValidationMessages.CourseCategoryInvalid)
                .NotEqual(Guid.Empty)
                .WithMessage(ValidationMessages.CourseCategoryInvalid);

            RuleFor(x => x.StatusId).InclusiveBetween(1, 3).WithMessage(ValidationMessages.CourseStatusInvalid);

            RuleFor(x => x.LevelId).InclusiveBetween(1, 3).WithMessage(ValidationMessages.CourseLevelInvalid);

            RuleFor(x => x.Duration)
                .NotEmpty()
                .WithMessage(ValidationMessages.CourseDurationRequired)
                .MinimumLength(6)
                .WithMessage(ValidationMessages.CourseDurationMinLength)
                .MaximumLength(100)
                .WithMessage(ValidationMessages.CourseDurationMaxLength)
                .Must(duration => !string.IsNullOrWhiteSpace(duration))
                .WithMessage(ValidationMessages.CourseDurationRequired);

            RuleForEach(x => x.Tags)
                .MaximumLength(50)
                .WithMessage(ValidationMessages.CourseTagMaxLength)
                .Must(tag => !string.IsNullOrWhiteSpace(tag))
                .WithMessage(ValidationMessages.CourseTagRequired);

            RuleFor(x => x.Tags)
                .Must(tags => tags.Distinct(StringComparer.OrdinalIgnoreCase).Count() == tags.Count)
                .WithMessage(ValidationMessages.CourseTagDuplicate);

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage(ValidationMessages.CourseDescriptionRequired)
                .MaximumLength(1000)
                .WithMessage(ValidationMessages.CourseDescriptionMaxLength)
                .Must(description => !string.IsNullOrWhiteSpace(description))
                .WithMessage(ValidationMessages.CourseDescriptionRequired);
        }
    }
}
