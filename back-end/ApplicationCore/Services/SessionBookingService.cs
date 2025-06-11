using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Sessions;
using ApplicationCore.DTOs.Responses.Dashboards.Mentors;
using ApplicationCore.DTOs.Responses.Sessions;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;


namespace ApplicationCore.Services
{
    public class SessionBookingService : ISessionBookingService
    {
        private readonly ISessionBookingRepository _sessionBookingRepository;
        private readonly IMentorTimeAvailableRepository _mentorTimeAvailableRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISendEmailService _sendEmailService;

        public SessionBookingService(ISessionBookingRepository sessionBookingRepository, IMentorTimeAvailableRepository mentorTimeAvailableRepository, IUserRepository userRepository, IUnitOfWork unitOfWork, ISendEmailService sendEmailService, ICourseRepository courseRepository)
        {
            _sessionBookingRepository = sessionBookingRepository;
            _mentorTimeAvailableRepository = mentorTimeAvailableRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _sendEmailService = sendEmailService;
            _courseRepository = courseRepository;
        }

        public async Task<OperationResult<SessionStatusCountResponse>> GetSessionStatusCounts()
        {
            var session = await _sessionBookingRepository.GetAllAsync();
            var upcomingSessions = session.Count(s => s.StatusId == 6);
            var pastSessions = session.Count(s => s.StatusId == 5 || s.StatusId == 4);
            var response = new SessionStatusCountResponse
            {
                UpcomingSessionCount = upcomingSessions,
                PastSessionCount = pastSessions,
            };

            return OperationResult<SessionStatusCountResponse>.Ok(response);
        }

        public async Task<OperationResult<PagedResult<SessionStatusResponse>>> GetAllSessions(SessionQueryParameters paginationParameters, Guid mentorId)
        {
            if (paginationParameters.StatusId.HasValue &&
       paginationParameters.StatusId != 4 &&
       paginationParameters.StatusId != 5 &&
       paginationParameters.StatusId != 6)
            {
                return OperationResult<PagedResult<SessionStatusResponse>>.BadRequest("Invalid session status. Only statuses 4 (Cancelled), 5 (Completed), or 6 (Scheduled) are allowed.");
            }

            Func<IQueryable<SessionBooking>, IQueryable<SessionBooking>> filter = q =>
                q.Where(s =>
                    s.MentorId == mentorId &&
                    (!paginationParameters.StatusId.HasValue
                        ? s.StatusId == 4 || s.StatusId == 5 || s.StatusId == 6
                        : s.StatusId == paginationParameters.StatusId.Value));

            var (sessions, totalCount) = await _sessionBookingRepository.GetPagedAsync(
                filter,
                paginationParameters.PageIndex,
                paginationParameters.PageSize
            );

            var pagedResult = new PagedResult<SessionStatusResponse>
            {
                Items = sessions.ToSessionStatusResponseList(),
                PageIndex = paginationParameters.PageIndex,
                PageSize = paginationParameters.PageSize,
                TotalItems = totalCount
            };

            return OperationResult<PagedResult<SessionStatusResponse>>.Ok(pagedResult);
        }

        public async Task<OperationResult<CreatedBookingResponseDto>> CreateNewBookingAsync(Guid learnerId, CreateBookingRequestDto bookingRequest)
        {
            var learner = await _userRepository.GetByIdWithUserProfileAsync(learnerId);
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

            if (slot.StatusId != 1 && slot.StatusId != 4)
            {
                return OperationResult<CreatedBookingResponseDto>.BadRequest("The selected availability slot is no longer available.");
            }

            DateTime fullSlotStartTime = slot.MentorDayAvailable.Day.ToDateTime(slot.Start);
            DateTime combinedDateTimeUtc = DateTime.SpecifyKind(fullSlotStartTime, DateTimeKind.Local);
            DateTime currentDate = DateTimeHelper.GetCurrentVietnamTime();
            if (combinedDateTimeUtc <= currentDate)
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

            slot.StatusId = 4;
            await _sessionBookingRepository.AddAsync(newBooking);
            await _unitOfWork.SaveChangesAsync();

            var createdBookingDetails = await _sessionBookingRepository.GetBookingDetailsForDtoAsync(newBooking.Id);
            await SendBookingRequestConfirmationToLearner(learner!, mentor.UserProfile, createdBookingDetails!);
            await SendNewBookingRequestToMentor(mentor, learner!.UserProfile, createdBookingDetails!);

            var createdBooking = await _sessionBookingRepository.GetByIdAsync(newBooking.Id);
            var responseDto = createdBooking!.ToCreatedBookingResponseDto();

            return OperationResult<CreatedBookingResponseDto>.Created(responseDto, "Session booking created successfully.");
        }

        public async Task<OperationResult<PagedResult<MentorBookingDetailsDto>>> GetBookingsForMentorAsync(Guid userId, MentorBookingsQueryParameters queryParameters)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            bool IsMentor = user!.RoleId == 3;

            Func<IQueryable<SessionBooking>, IQueryable<SessionBooking>> filter = query =>
        {
            if (queryParameters.StatusIds.Any())
            {
                query = query.Where(sb => queryParameters.StatusIds.Contains(sb.StatusId));
            }

            if (queryParameters.FromSessionDate.HasValue)
            {
                query = query.Where(sb => sb.MentorTimeAvailable.MentorDayAvailable.Day >= queryParameters.FromSessionDate.Value);
            }

            if (IsMentor)
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

            if (queryParameters.StatusIds.Contains(1))
            {
                query = query.OrderBy(s => s.CreatedAt);
            }

            if (!string.IsNullOrWhiteSpace(queryParameters.Query))
            {
                string searchTerm = queryParameters.Query.ToLower().Trim();
                if (IsMentor)
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
                LearnerPhotoData = sb.Learner.UserProfile.PhotoData != null
                ? $"data:image/png;base64,{Convert.ToBase64String(sb.Learner.UserProfile.PhotoData)}"
                : string.Empty,
                MentorPhotoData = sb.Mentor.UserProfile.PhotoData != null
                ? $"data:image/png;base64,{Convert.ToBase64String(sb.Mentor.UserProfile.PhotoData)}"
                : string.Empty,
                LearnerFullName = sb.Learner!.UserProfile.FullName,
                MentorId = sb.MentorId,
                MentorFullName = sb.Mentor.UserProfile.FullName,
                AvailabilityTimeSlotId = sb.MentorTimeAvailableId,
                Date = sb.MentorTimeAvailable.MentorDayAvailable.Day,
                SlotStartTime = sb.MentorTimeAvailable.Start,
                SlotEndTime = sb.MentorTimeAvailable.End,
                LearnerMessage = sb.LearnerMessage,
                StatusName = sb.Status.Name,
                SessionTypeName = sb.SessionType.Name,
                BookingRequestedAt = sb.CreatedAt,
                CancelReason = sb.CancelReason
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

            if (booking.StatusId == 5 || booking.StatusId == 4)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("Cannot update when status is Completed or Cancelled.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user != null && user.RoleId == 3)
            {
                if (booking.MentorId != userId)
                {
                    return OperationResult<UpdateBookingResponseDto>.Unauthorized("You are not authorized to update this booking.");
                }

                if (booking.StatusId != 1 && booking.StatusId != 2 && booking.StatusId != 6)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be updated as it's not in a pending or rescheduled state or has already been processed.");
                }

                if (booking.StatusId == 2 && updateRequest.NewStatusId == 6)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be accepted as waiting for learner processing or you can decline the booking.");
                }

                var isRescheduledExist = await _sessionBookingRepository.AnyAsync(s => s.MentorTimeAvailableId == booking.MentorTimeAvailableId && s.StatusId == 2 && s.Id != sessionId);

                if (isRescheduledExist && updateRequest.NewStatusId != 5 && updateRequest.NewStatusId != 3)
                {
                    return OperationResult<UpdateBookingResponseDto>.BadRequest("This booking session cannot be scheduled as still there is an existing rescheduled state.");
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
                case 3:
                    booking.StatusId = 3;
                    break;

                case 4:
                    booking.StatusId = 4;
                    break;

                case 5:
                    booking.StatusId = 5;
                    booking.CancelReason = updateRequest.CancelReason;
                    await SendBookingCancelledEmailAsync(booking);
                    break;

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
                    await SendBookingAcceptedEmailToLearnerAsync(booking);
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

            if (originalBooking.StatusId != 1)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest($"Only 'Pending' sessions can be rescheduled. Current status is '{originalBooking.Status.Name}'.");
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

            if (newSlot.StatusId != 1 && newSlot.StatusId != 4)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("The new selected slot is not available for reschedule.");
            }

            DateTime currentDate = DateTimeHelper.GetCurrentVietnamTime();
            DateTime fullNewSlotStartTime = newSlot.MentorDayAvailable.Day.ToDateTime(newSlot.Start);
            if (fullNewSlotStartTime <= currentDate)
            {
                return OperationResult<UpdateBookingResponseDto>.BadRequest("The new selected slot must be in the future.");
            }

            originalBooking.StatusId = 2;
            originalBooking.MentorTimeAvailableId = newSlot.Id;

            await _unitOfWork.SaveChangesAsync();
            var updatedBookingStatus = await _sessionBookingRepository.GetByIdAsync(sessionId);
            var response = updatedBookingStatus!.ToUpdateBookingResponseDto();

            return OperationResult<UpdateBookingResponseDto>.Ok(response);
        }

        private async Task SendBookingRequestConfirmationToLearner(User learner, UserProfile mentorProfile, SessionBooking bookingDetails)
        {
            var platformName = "MentorPlatform";
            string mentorFullNameSafe = System.Net.WebUtility.HtmlEncode(mentorProfile.FullName);
            string learnerFullNameSafe = System.Net.WebUtility.HtmlEncode(learner.UserProfile?.FullName ?? "Learner");
            var emailSubject = $"Your Mentorship Session Request with {mentorFullNameSafe} is Pending";

            var bodyHtml = new StringBuilder();

            bodyHtml.Append("<html><body>");

            bodyHtml.Append($"<p>Hi {learnerFullNameSafe},</p>");

            bodyHtml.Append($"<p>Thank you for booking a mentorship session with <strong>{mentorFullNameSafe}</strong> on {platformName}.</p>");
            bodyHtml.Append("<p>Your request has been sent and is currently awaiting confirmation from the mentor.</p>");

            bodyHtml.Append("<p><strong>Session Details:</strong></p>");
            bodyHtml.Append("<ul>");

            bodyHtml.Append($"<li>Mentor: {mentorFullNameSafe}</li>");

            var slotStartTime = bookingDetails.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(bookingDetails.MentorTimeAvailable.Start, DateTimeKind.Local);
            string formattedSlotStartTime = slotStartTime.ToString("dddd, MMMM d, yyyy 'at' h:mm tt", CultureInfo.InvariantCulture);
            bodyHtml.Append($"<li>Requested Time: {formattedSlotStartTime}</li>");

            if (!string.IsNullOrWhiteSpace(bookingDetails.LearnerMessage))
            {
                bodyHtml.Append($"<li>Your Message: {System.Net.WebUtility.HtmlEncode(bookingDetails.LearnerMessage)}</li>");
            }
            bodyHtml.Append("</ul>");

            bodyHtml.Append("<p>You will receive another email once the mentor confirms or modifies your request.</p>");

            bodyHtml.Append("<p>Best regards,<br />The MentorPlatform Team</p>");

            bodyHtml.Append("<hr />");
            bodyHtml.Append("<p>If you have any questions, feel free to contact our support team.</p>");

            bodyHtml.Append("</body></html>");

            await _sendEmailService.SendEmail(learner.Email, emailSubject, bodyHtml.ToString());
        }

        private async Task SendNewBookingRequestToMentor(User mentor, UserProfile learnerProfile, SessionBooking bookingDetails)
        {
            var platformName = "MentorPlatform";
            var emailSubject = $"New Mentorship Session Request from {learnerProfile.FullName}";

            var bodyHtml = new StringBuilder();
            bodyHtml.Append("<html><body>");
            bodyHtml.Append($"<p>Hi {mentor.UserProfile?.FullName ?? "Mentor"},</p>");
            bodyHtml.Append($"<p>You have received a new mentorship session request from {learnerProfile.FullName} on {platformName}.</p>");
            bodyHtml.Append("<p><strong>Booking Details:</strong></p>");
            bodyHtml.Append("<ul>");
            bodyHtml.Append($"<li>Learner: {learnerProfile.FullName} (Email: {bookingDetails.Learner.Email})</li>");
            var slotStartTime = bookingDetails.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(bookingDetails.MentorTimeAvailable.Start, DateTimeKind.Local);
            bodyHtml.Append($"<li>Requested Time: {slotStartTime:dddd, MMMM d, yyyy 'at' h:mm tt}</li>");
            if (!string.IsNullOrWhiteSpace(bookingDetails.LearnerMessage))
            {
                bodyHtml.Append($"<li>Learner's Message: {bookingDetails.LearnerMessage}</li>");
            }
            bodyHtml.Append("</ul>");
            bodyHtml.Append("<p>Please log in to your dashboard to review and respond to this request.</p>");
            bodyHtml.Append("<p>Best regards,<br>The MentorPlatform Team</p>");
            bodyHtml.Append("</body></html>");

            await _sendEmailService.SendEmail(mentor.Email, emailSubject, bodyHtml.ToString(), true);
        }

        private async Task SendBookingAcceptedEmailToLearnerAsync(SessionBooking acceptedBooking)
        {
            var platformName = "MentorPlatform";
            var learnerName = System.Net.WebUtility.HtmlEncode(acceptedBooking.Learner.UserProfile?.FullName ?? "Learner");
            var mentorName = System.Net.WebUtility.HtmlEncode(acceptedBooking.Mentor.UserProfile?.FullName ?? "your Mentor");
            var emailSubject = $"Your Mentorship Session with {mentorName} has been Confirmed on {platformName}!";

            var bodyHtml = new StringBuilder();
            bodyHtml.Append("<html><body>");
            bodyHtml.Append($"<p>Hi {learnerName},</p>");
            bodyHtml.Append($"<p>Great news! Your mentorship session request with <strong>{mentorName}</strong> has been accepted.</p>");

            bodyHtml.Append("<p><strong>Confirmed Session Details:</strong></p>");
            bodyHtml.Append("<ul>");

            var slotStartTime = acceptedBooking.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(acceptedBooking.MentorTimeAvailable.Start, DateTimeKind.Local);
            string formattedTime = slotStartTime.ToString("dddd, MMMM d, yyyy 'at' h:mm tt", System.Globalization.CultureInfo.InvariantCulture) + "";
            bodyHtml.Append($"<li>Time: {formattedTime}</li>");
            bodyHtml.Append($"<li>Mentor: {mentorName}</li>");

            bodyHtml.Append("</ul>");

            bodyHtml.Append("<p>Please be prepared for your session.</p>");
            bodyHtml.Append("<p>Best regards,<br />The MentorPlatform Team</p>");
            bodyHtml.Append("</body></html>");

            await _sendEmailService.SendEmail(acceptedBooking.Learner.Email, emailSubject, bodyHtml.ToString(), true);
        }

        public async Task<OperationResult<MentorDashboardDto>> GetSessionDashBoardAsync(Guid userId, PaginationParameters paginationParameters)
        {
            paginationParameters.PageSize = 3;
            DateTime currentDate = DateTimeHelper.GetCurrentVietnamTime();
            SessionDashboardKpiDto sessionDashboardKpiDto = new SessionDashboardKpiDto();
            sessionDashboardKpiDto.SessionsThisMonth = await _sessionBookingRepository
                                                        .GetAllQueryable()
                                                        .Include(x => x.MentorTimeAvailable)
                                                        .ThenInclude(t => t.MentorDayAvailable)
                                                        .Where(s => s.MentorId == userId && s.MentorTimeAvailable.MentorDayAvailable.Day.Month == currentDate.Month).CountAsync();

            sessionDashboardKpiDto.LifetimeLearners = await _sessionBookingRepository
                                                         .GetAllQueryable()
                                                         .Where(s => s.MentorId == userId)
                                                         .Select(s => s.LearnerId)
                                                         .Distinct()
                                                         .CountAsync();

            var courses = await _courseRepository
                                                         .GetAllQueryable()
                                                         .Include(x => x.Resources)
                                                         .Where(s => s.MentorId == userId).ToListAsync();

            foreach (var course in courses)
            {
                sessionDashboardKpiDto.SharedResources += course.Resources.Count;
            }

            Func<IQueryable<SessionBooking>, IQueryable<SessionBooking>> filter = query =>
            {
                query = query.Where(sb => sb.StatusId == 6);
                query = query.Where(sb => sb.MentorId == userId);
                query = query.OrderBy(sb => sb.MentorTimeAvailable.MentorDayAvailable.Day)
                .ThenBy(sb => sb.MentorTimeAvailable.Start);

                DateOnly todayUtc = DateOnly.FromDateTime(currentDate);
                TimeOnly timeNowUtc = TimeOnly.FromDateTime(currentDate);
                query = query.Where(up => up.MentorTimeAvailable.StatusId == 2 && ((up.MentorTimeAvailable.Start > timeNowUtc
                && up.MentorTimeAvailable.MentorDayAvailable.Day == todayUtc) || up.MentorTimeAvailable.MentorDayAvailable.Day > todayUtc)
                );

                return query;
            };

            var (mentorBookings, totalItems) = await _sessionBookingRepository.GetPagedAsync(
                filter,
                paginationParameters.PageIndex,
                paginationParameters.PageSize
            );

            var bookingDtos = mentorBookings.Select(sb => new UpcomingSessionDto
            {
                BookingId = sb.Id,
                LearnerId = sb.LearnerId,
                LearnerPhotoData = sb.Learner.UserProfile.PhotoData != null
                ? $"data:image/png;base64,{Convert.ToBase64String(sb.Learner.UserProfile.PhotoData)}"
                : string.Empty,
                LearnerFullName = sb.Learner!.UserProfile.FullName,
                AvailabilityTimeSlotId = sb.MentorTimeAvailableId,
                Date = sb.MentorTimeAvailable.MentorDayAvailable.Day,
                SlotStartTime = sb.MentorTimeAvailable.Start,
                SlotEndTime = sb.MentorTimeAvailable.End,
                LearnerMessage = sb.LearnerMessage,
                StatusName = sb.Status.Name,
                SessionTypeName = sb.SessionType.Name,
            }).ToList();

            MentorDashboardDto mentorDashboardDto = new MentorDashboardDto() { SessionKPIs = sessionDashboardKpiDto, UpcomingSessions = bookingDtos };

            return OperationResult<MentorDashboardDto>.Ok(mentorDashboardDto);
        }

        private async Task SendBookingCancelledEmailAsync(SessionBooking cancelledBooking)
        {
            var mentorName = System.Net.WebUtility.HtmlEncode(cancelledBooking.Mentor.UserProfile?.FullName);
            var learnerName = System.Net.WebUtility.HtmlEncode(cancelledBooking.Learner.UserProfile?.FullName);
            var cancelReason = System.Net.WebUtility.HtmlEncode(cancelledBooking.CancelReason);
            var slotStartTime = cancelledBooking.MentorTimeAvailable.MentorDayAvailable.Day.ToDateTime(cancelledBooking.MentorTimeAvailable.Start, DateTimeKind.Utc);
            string formattedTime = slotStartTime.ToString("dddd, MMMM d, yyyy 'at' h:mm tt", System.Globalization.CultureInfo.InvariantCulture);

            var subjectToLearner = $"Your session with {mentorName} has been cancelled";
            var bodyToLearner = new StringBuilder();
            bodyToLearner.Append("<html><body>");
            bodyToLearner.Append($"<p>Hi {learnerName},</p>");
            bodyToLearner.Append($"<p>Please be advised that your scheduled mentorship session with <strong>{mentorName}</strong> has been cancelled.</p>");
            bodyToLearner.Append("<p><strong>Session Details:</strong></p>");
            bodyToLearner.Append("<ul>");
            bodyToLearner.Append($"<li>Time: {formattedTime}</li>");
            bodyToLearner.Append($"<li>Reason for cancellation: {cancelReason}</li>");
            bodyToLearner.Append("</ul>");
            bodyToLearner.Append("<p>We encourage you to visit the mentor's profile to book another time if you wish.</p>");
            bodyToLearner.Append("<p>Best regards,<br />The MentorPlatform Team</p>");
            bodyToLearner.Append("</body></html>");

            await _sendEmailService.SendEmail(cancelledBooking.Learner.Email, subjectToLearner, bodyToLearner.ToString(), true);
        }
    }
}
