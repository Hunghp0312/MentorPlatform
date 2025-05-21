using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Categories;
using FluentValidation;

namespace ApplicationCore.Validators.Categories
{
    public class CategoryRequestDtoValidator : AbstractValidator<CategoryRequest>
    {
        public CategoryRequestDtoValidator()
        {
            RuleFor(x => x.Name)
             .NotEmpty().WithMessage(ValidationMessages.CategoryNameRequired)
             .MaximumLength(100).WithMessage(ValidationMessages.CategoryNameMaxLength);

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage(ValidationMessages.CategoryDescriptionMaxLength);

            RuleFor(x => x.StatusId)
                 .InclusiveBetween(1, 2).WithMessage(ValidationMessages.CategoryStatusInvalid);
        }
    }
}
