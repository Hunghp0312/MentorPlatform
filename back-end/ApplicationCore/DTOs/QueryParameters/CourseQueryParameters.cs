using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class CourseQueryParameters : PaginationParameters
    {
        public int? Level { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? MentorId { get; set; }
    }
}
