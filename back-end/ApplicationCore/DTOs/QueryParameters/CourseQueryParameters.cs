using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class CourseQueryParameters : PaginationParameters
    {
        public CourseLevel? Level { get; set; }//làm type thì để ý sửa
        public Guid? CategoryId { get; set; }
        public Guid? MentorId { get; set; }
    }
}
