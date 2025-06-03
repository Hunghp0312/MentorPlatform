using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Sessions;
using FluentValidation;

namespace ApplicationCore.Validators.SessionBookings
{
    public class CreateBookingRequestDtoValidator : AbstractValidator<CreateBookingRequestDto>
    {
        public CreateBookingRequestDtoValidator()
        {
            RuleFor(x => x.SessionTypeId)
              .InclusiveBetween(1, 3)
              .WithMessage(ValidationMessages.SessionTypeIdInvalidRange);
        }
    }
}
