using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class CourseQueryParameters : PaginationParameters
    {
        public string? Query { get; set; }
        public CourseLevel? Level { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? MentorId { get; set; }
    }
}
