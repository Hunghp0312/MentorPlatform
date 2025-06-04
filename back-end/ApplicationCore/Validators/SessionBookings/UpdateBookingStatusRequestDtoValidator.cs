using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Sessions;
using FluentValidation;

namespace ApplicationCore.Validators.SessionBookings
{
    public class UpdateBookingStatusRequestDtoValidator : AbstractValidator<UpdateBookingStatusRequestDto>
    {
        public UpdateBookingStatusRequestDtoValidator()
        {
            RuleFor(x => x.NewStatusId)
              .InclusiveBetween(1, 6)
              .WithMessage(ValidationMessages.SessionStatusIdInvalidRange);
        }
    }
}
