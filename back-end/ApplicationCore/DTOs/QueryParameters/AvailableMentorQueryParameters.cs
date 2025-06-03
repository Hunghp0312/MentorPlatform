using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class AvailableMentorQueryParameters : PaginationParameters
    {
        public int ExpertiseId { get; set; }
    }
}
