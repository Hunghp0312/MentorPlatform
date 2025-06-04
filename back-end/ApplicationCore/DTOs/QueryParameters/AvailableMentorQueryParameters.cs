using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class AvailableMentorQueryParameters : PaginationParameters
    {
        public int TopicId { get; set; }
        public List<int> ExpertiseIds { get; set; } = new List<int>();
    }
}
