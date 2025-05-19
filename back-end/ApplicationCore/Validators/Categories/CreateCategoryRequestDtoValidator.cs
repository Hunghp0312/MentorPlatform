using ApplicationCore.DTOs.Category;
using FluentValidation;

namespace ApplicationCore.Validators.Category
{
    public class CreateCategoryRequestDtoValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryRequestDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required and cannot be empty.")
                .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required and cannot be empty.")
                .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");

            RuleFor(x => x.Status)
                 .IsInEnum().WithMessage("Invalid category status value.");
        }
    }
}
