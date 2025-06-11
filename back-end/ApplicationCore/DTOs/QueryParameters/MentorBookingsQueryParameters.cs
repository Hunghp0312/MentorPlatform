using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class MentorBookingsQueryParameters : PaginationParameters
    {
        public List<int> StatusIds { get; set; } = new List<int>();
        public DateOnly? FromSessionDate { get; set; }
        public DateOnly? ToSessionDate { get; set; }
    }
}
