using ApplicationCore.Constants;
using ApplicationCore.DTOs.Category;
using FluentValidation;

namespace ApplicationCore.Validators.Category
{
    public class CategoryRequestDtoValidator : AbstractValidator<CategoryRequest>
    {
        public CategoryRequestDtoValidator()
        {
            RuleFor(x => x.Name)
             .NotEmpty().WithMessage(ValidationMessages.CategoryNameRequired)
             .MaximumLength(100).WithMessage(ValidationMessages.CategoryNameMaxLength);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage(ValidationMessages.CategoryDescriptionRequired)
                .MaximumLength(1000).WithMessage(ValidationMessages.CategoryDescriptionMaxLength);

            RuleFor(x => x.Status)
                 .IsInEnum().WithMessage(ValidationMessages.CategoryStatusInvalid);
        }
    }
}
