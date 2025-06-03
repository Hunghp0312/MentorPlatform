using ApplicationCore.DTOs.Responses.Sessions;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class SessionBookingExtension
    {
        public static CreatedBookingResponseDto ToCreatedBookingResponseDto(this SessionBooking sessionBooking)
        {
            return new CreatedBookingResponseDto
            {
                Id = sessionBooking.Id,
                CreatedAt = sessionBooking.CreatedAt,
            };
        }

        public static UpdateBookingResponseDto ToUpdateBookingResponseDto(this SessionBooking sessionBooking)
        {
            return new UpdateBookingResponseDto
            {
                Id = sessionBooking.Id,
                StatusId = sessionBooking.StatusId
            };
        }
    }
}
