using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.SessionBookings;
using ApplicationCore.DTOs.Responses.SessionBookings;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Common;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services
{
    public class SessionBookingService : ISessionBookingService
    {
        private readonly ISessionBookingRepository _sessionBookingRepository;
        private readonly IUnitOfWork _unitOfWork;
        public SessionBookingService(ISessionBookingRepository sessionBookingRepository, IUnitOfWork unitOfWork)
        {
            _sessionBookingRepository = sessionBookingRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<SessionStatusResponse>> UpdateSessionStatus(SessionUpdateStatusRequest request)
        {
            var session = await _sessionBookingRepository.GetByIdAsync(request.SessionId);
            if (session == null)
            {
                return OperationResult<SessionStatusResponse>.NotFound("Session not found");
            }

            session.Id = request.SessionId;
            session.StatusId = request.StatusId;

            var response = new SessionStatusResponse
            {
                UserId = request.UserId,
                FullName = session.Mentor.UserProfile?.FullName ?? string.Empty,
                SessionId = session.Id,
                SessionStatus = session.Status
            };

            _sessionBookingRepository.Update(session);
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<SessionStatusResponse>.Ok(response);
        }
        private readonly ISessionBookingRepository _sessionBookingRepository;
        private readonly IMentorAvailabilitySlotRepository _mentorAvailabilitySlotRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SessionBookingService(ISessionBookingRepository sessionBookingRepository, IMentorAvailabilitySlotRepository mentorAvailabilitySlotRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _sessionBookingRepository = sessionBookingRepository;
            _mentorAvailabilitySlotRepository = mentorAvailabilitySlotRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest)
        {
            var mentor = await _userRepository.GetByIdAsync(bookingRequest.MentorId);
            if (mentor == null)
            {
                return OperationResult<CreatedBookingResponseDto>.NotFound($"Mentor with ID '{bookingRequest.MentorId}' not found.");
            }

            var slot = await _mentorAvailabilitySlotRepository.GetByIdAsync(bookingRequest.AvailabilitySlotId);
            if (slot == null)
            {
                return OperationResult<CreatedBookingResponseDto>.NotFound($"Availability slot with ID '{bookingRequest.AvailabilitySlotId}' not found.");
            }

            if (slot.MentorId != bookingRequest.MentorId)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("The selected availability slot does not belong to the specified mentor.");
            }

            if (slot.StatusId != 1)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("The selected availability slot is no longer available.");
            }

            if (slot.StartTime <= DateTime.UtcNow)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("Cannot book a session for a past or current time slot.");
            }

            bool bookingAlreadyExists = await _sessionBookingRepository.ExistsBookingForSlotAsync(learnerId, bookingRequest.MentorId, bookingRequest.AvailabilitySlotId);
            if (bookingAlreadyExists)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("You have already requested or booked this specific time slot with this mentor.");
            }

            var newBooking = new SessionBooking
            {
                Id = Guid.NewGuid(),
                LearnerId = learnerId,
                MentorId = bookingRequest.MentorId,
                AvailabilitySlotId = bookingRequest.AvailabilitySlotId,
                LearnerMessage = bookingRequest.LearnerMessage,
                CreatedAt = DateTime.UtcNow,
                StatusId = 1,
                SessionTypeId = bookingRequest.SessionTypeId
            };

            await _sessionBookingRepository.AddAsync(newBooking);
            await _unitOfWork.SaveChangesAsync();

            var createdBooking = await _sessionBookingRepository.GetByIdAsync(newBooking.Id);
            var responseDto = createdBooking!.ToCreatedBookingResponseDto();

            return OperationResult<CreatedBookingResponseDto>.Created(responseDto, "Session booking created successfully.");
        }
    }
}
