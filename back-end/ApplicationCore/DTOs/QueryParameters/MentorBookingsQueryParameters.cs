using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class MentorBookingsQueryParameters : PaginationParameters
    {
        public int? StatusId { get; set; }
        public DateOnly? FromSessionDate { get; set; }
        public DateOnly? ToSessionDate { get; set; }
        public bool IsMentor { get; set; }
    }
}
