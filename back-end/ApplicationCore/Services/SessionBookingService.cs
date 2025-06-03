using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Sessions;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;

namespace ApplicationCore.Services
{
    public class SessionBookingService : ISessionBookingService
    {
        private readonly ISessionBookingRepository _sessionBookingRepository;
        private readonly IMentorTimeAvailableRepository _mentorTimeAvailableRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SessionBookingService(ISessionBookingRepository sessionBookingRepository, IMentorTimeAvailableRepository mentorTimeAvailableRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _sessionBookingRepository = sessionBookingRepository;
            _mentorTimeAvailableRepository = mentorTimeAvailableRepository;
            _userRepository = userRepository;
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

        public async Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest)
        {
            var mentor = await _userRepository.GetByIdAsync(bookingRequest.MentorId);
            if (mentor == null || mentor.RoleId != 3)
            {
                return OperationResult<CreatedBookingResponseDto>.NotFound($"Mentor with ID '{bookingRequest.MentorId}' not found.");
            }

            var slot = await _mentorTimeAvailableRepository.GetByIdAsync(bookingRequest.MentorTimeAvailableId);
            if (slot == null)
            {
                return OperationResult<CreatedBookingResponseDto>.NotFound($"Availability slot with ID '{bookingRequest.MentorTimeAvailableId}' not found.");
            }

            if (slot.MentorDayAvailable.MentorId != bookingRequest.MentorId)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("The selected availability slot does not belong to the specified mentor.");
            }

            if (slot.StatusId != 1)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("The selected availability slot is no longer available.");
            }

            DateTime fullSlotStartTime = slot.MentorDayAvailable.Day.ToDateTime(slot.Start);
            DateTime combinedDateTimeUtc = DateTime.SpecifyKind(fullSlotStartTime, DateTimeKind.Utc);
            if (combinedDateTimeUtc <= DateTime.UtcNow)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("Cannot book a session for a past or current time slot.");
            }

            bool bookingAlreadyExists = await _sessionBookingRepository.ExistsBookingForSlotAsync(learnerId, bookingRequest.MentorId, bookingRequest.MentorTimeAvailableId);
            if (bookingAlreadyExists)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("You have already requested or booked this specific time slot with this mentor.");
            }

            var newBooking = new SessionBooking
            {
                Id = Guid.NewGuid(),
                LearnerId = learnerId,
                MentorId = bookingRequest.MentorId,
                MentorTimeAvailableId = bookingRequest.MentorTimeAvailableId,
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

        public async Task<OperationResult<PagedResult<MentorBookingDetailsDto>>> GetBookingsForMentorAsync(Guid userId, MentorBookingsQueryParameters queryParameters)
        {
            Func<IQueryable<SessionBooking>, IQueryable<SessionBooking>> filter = query =>
            {
                if (queryParameters.StatusId.HasValue && queryParameters.StatusId > 0 && queryParameters.StatusId < 7)
                {
                    query = query.Where(sb => sb.StatusId == queryParameters.StatusId.Value);
                }

                if (queryParameters.FromSessionDate.HasValue)
                {
                    query = query.Where(sb => sb.MentorTimeAvailable.MentorDayAvailable.Day >= queryParameters.FromSessionDate.Value);
                }

                if (queryParameters.IsMentor)
                {
                    query = query.Where(sb => sb.MentorId == userId);
                }
                else
                {
                    query = query.Where(sb => sb.LearnerId == userId);
                }

                if (queryParameters.ToSessionDate.HasValue)
                {
                    query = query.Where(sb => sb.MentorTimeAvailable.MentorDayAvailable.Day <= queryParameters.ToSessionDate.Value);
                }

                if (!string.IsNullOrWhiteSpace(queryParameters.Query))
                {
                    string searchTerm = queryParameters.Query.ToLower().Trim();
                    if (queryParameters.IsMentor)
                    {
                        query = query.Where(up =>
                      up.Learner.UserProfile.FullName.ToLower().Contains(searchTerm)
                        );
                    }
                    else
                    {
                        query = query.Where(up =>
                    up.Mentor.UserProfile.FullName.ToLower().Contains(searchTerm)
                      );
                    }

                }

                return query;
            };

            var (mentorBookings, totalItems) = await _sessionBookingRepository.GetPagedAsync(
                filter,
                queryParameters.PageIndex,
                queryParameters.PageSize
            );

            var bookingDtos = mentorBookings.Select(sb => new MentorBookingDetailsDto
            {
                BookingId = sb.Id,
                LearnerId = sb.LearnerId,
                LearnerFullName = sb.Learner.UserProfile.FullName,
                MentorId = sb.MentorId,
                MentorFullName = sb.Mentor.UserProfile.FullName,
                AvailabilityTimeSlotId = sb.MentorTimeAvailableId,
                SlotStartTime = sb.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(sb.MentorTimeAvailable.Start, DateTimeKind.Utc),
                SlotEndTime = sb.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(sb.MentorTimeAvailable.End, DateTimeKind.Utc),
                LearnerMessage = sb.LearnerMessage,
                StatusId = sb.StatusId,
                SessionTypeId = sb.SessionTypeId,
                BookingRequestedAt = sb.CreatedAt
            }).ToList();

            var pagedResult = new PagedResult<MentorBookingDetailsDto>
            {
                TotalItems = totalItems,
                PageIndex = queryParameters.PageIndex,
                PageSize = queryParameters.PageSize,
                Items = bookingDtos
            };

            return OperationResult<PagedResult<MentorBookingDetailsDto>>.Ok(pagedResult);
        }

        public async Task<OperationResult<UpdateBookingResponseDto>> UpdateBookingStatusAsync(Guid sessionId, Guid userId, UpdateBookingStatusRequestDto updateRequest)
        {
            if (updateRequest.NewStatusId == 5 && string.IsNullOrEmpty(updateRequest.CancelReason))
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("When cancel need to provide reason.");
            }
            var booking = await _sessionBookingRepository.GetByIdAsync(sessionId);

            if (booking == null)
            {
                return OperationResult<UpdateBookingResponseDto>.NotFound("Booking session not found.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user != null && user.RoleId == 3)
            {
                if (booking.MentorId != userId)
                {
                    return OperationResult<UpdateBookingResponseDto>.Unauthorized("You are not authorized to update this booking.");
                }

                if (booking.StatusId != 1 && booking.StatusId != 2)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be updated as it's not in a pending or rescheduled state or has already been processed.");
                }

                if (booking.StatusId == 2 && updateRequest.NewStatusId == 6)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be accepted as waiting for learner processing or you can decline the booking.");
                }


                var isRescheduledExist = await _sessionBookingRepository.AnyAsync(s => s.MentorTimeAvailableId == booking.MentorTimeAvailableId && s.StatusId == 2 && s.Id != sessionId);

                if (isRescheduledExist)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be updated as still there is an existing rescheduled state.");
                }
            }
            else
            {
                if (booking.LearnerId != userId)
                {
                    return OperationResult<UpdateBookingResponseDto>.Unauthorized("You are not authorized to update this booking.");
                }

                if (booking.StatusId != 2)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be updated as it's not in a Rescheduled state or has already been processed.");
                }

                if (updateRequest.NewStatusId != 6 && updateRequest.NewStatusId != 3)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("You can only scheduled or decline for this booking session in a rescheduled state.");
                }
            }

            switch (updateRequest.NewStatusId)
            {
                case 6:
                    var otherPendingBookings = await _sessionBookingRepository.FindAsync(sb => sb.MentorTimeAvailableId == booking.MentorTimeAvailableId &&
                              sb.Id != sessionId &&
                              sb.StatusId == 1);

                    foreach (var otherBooking in otherPendingBookings)
                    {
                        otherBooking.StatusId = 3;
                        _sessionBookingRepository.Update(otherBooking);
                    }

                    booking.StatusId = 6;
                    booking.MentorTimeAvailable.StatusId = 2;

                    break;

                case 3:
                    booking.StatusId = 3;

                    break;

                case 5:
                    booking.StatusId = 5;
                    booking.CancelReason = updateRequest.CancelReason;

                    break;

                default:
                    return OperationResult<UpdateBookingResponseDto>.BadRequest($"Invalid target status ID: {updateRequest.NewStatusId}.");
            }

            await _unitOfWork.SaveChangesAsync();
            var updatedBookingStatus = await _sessionBookingRepository.GetByIdAsync(sessionId);

            var response = updatedBookingStatus!.ToUpdateBookingResponseDto();
            return OperationResult<UpdateBookingResponseDto>.Ok(response);

        }

        public async Task<OperationResult<UpdateBookingResponseDto>> RescheduleBookingByMentorAsync(Guid sessionId, Guid mentorId, RescheduleBookingRequestDto rescheduleRequest)
        {
            var originalBooking = await _sessionBookingRepository.GetByIdAsync(sessionId);

            if (originalBooking == null)
            {
                return OperationResult<UpdateBookingResponseDto>.NotFound("Original booking session not found.");
            }

            if (originalBooking.MentorId != mentorId)
            {
                return OperationResult<UpdateBookingResponseDto>.Unauthorized("You are not authorized to reschedule this booking.");
            }

            if (originalBooking.StatusId != 6)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest($"Only 'Scheduled' sessions can be rescheduled. Current status is '{originalBooking.Status.Name}'.");
            }
            var oldSlot = originalBooking.MentorTimeAvailable;
            if (oldSlot.Id == rescheduleRequest.NewMentorTimeAvailableId)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("New slot cannot be the same as the current slot.");
            }

            var newSlot = await _mentorTimeAvailableRepository.GetByIdAsync(rescheduleRequest.NewMentorTimeAvailableId);

            if (newSlot == null)
            {
                return OperationResult<UpdateBookingResponseDto>.NotFound("New availability slot not found.");
            }

            if (newSlot.MentorDayAvailable.MentorId != mentorId)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("The new selected slot does not belong to you.");
            }

            if (newSlot.StatusId != 1)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("The new selected slot is not available for booking.");
            }

            DateTime fullNewSlotStartTime = newSlot.MentorDayAvailable.Day.ToDateTime(newSlot.Start, DateTimeKind.Utc);
            if (fullNewSlotStartTime <= DateTime.UtcNow)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("The new selected slot must be in the future.");
            }

            originalBooking.StatusId = 2;
            originalBooking.MentorTimeAvailableId = newSlot.Id;
            oldSlot.StatusId = 3;

            await _unitOfWork.SaveChangesAsync();
            var updatedBookingStatus = await _sessionBookingRepository.GetByIdAsync(sessionId);
            var response = updatedBookingStatus!.ToUpdateBookingResponseDto();

            return OperationResult<UpdateBookingResponseDto>.Ok(response);
        }
    }
}
