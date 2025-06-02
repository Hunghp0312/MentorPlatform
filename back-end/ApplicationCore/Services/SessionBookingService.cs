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

        public Task<OperationResult<MentorBookingDetailsDto>> AcceptBookingAsync(Guid sessionId, Guid mentorId)
        {
            throw new NotImplementedException();
        }

        //public async Task<OperationResult<MentorBookingDetailsDto>> AcceptBookingAsync(Guid sessionId, Guid mentorId)
        //{
        //    var booking = await _sessionBookingRepository.GetByIdAsync(sessionId);

        //    if (booking == null)
        //    {
        //        return OperationResult<MentorBookingDetailsDto>.NotFound("Booking session not found.");
        //    }

        //    if (booking.MentorId != mentorId)
        //    {
        //        return OperationResult<MentorBookingDetailsDto>.Unauthorized("You are not authorized to accept this booking.");
        //    }

        //    if (booking.StatusId != 1)
        //    {
        //        return OperationResult<MentorBookingDetailsDto>.BadRequest("This booking session cannot be accepted as it's not in a pending state or has already been processed.");
        //    }

        //    var otherPendingBookingsForSameSlot = await _sessionBookingRepository.GetQueryable()
        //       .Where(sb => sb.MentorTimeAvailableId == acceptedBooking.MentorTimeAvailableId &&
        //                      sb.Id != acceptedBooking.Id && // Loại trừ booking đang được chấp nhận
        //                      sb.StatusId == PENDING_BOOKING_STATUS_ID)
        //       .ToListAsync();

        //    booking.StatusId = 2;
        //    booking.MentorTimeAvailable.StatusId = 2;
        //    await _unitOfWork.SaveChangesAsync();
        //}
    }
}
