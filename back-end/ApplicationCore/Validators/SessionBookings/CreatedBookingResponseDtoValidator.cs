using ApplicationCore.Constants;
using ApplicationCore.DTOs.Responses.SessionBookings;
using FluentValidation;

namespace ApplicationCore.Validators.SessionBookings
{
    public class CreatedBookingResponseDtoValidator : AbstractValidator<CreatedBookingResponseDto>
    {
        public CreatedBookingResponseDtoValidator()
        {
            RuleFor(x => x.SessionTypeId)
              .InclusiveBetween(1, 3)
              .WithMessage(ValidationMessages.SessionTypeIdInvalidRange);
        }
    }
}
