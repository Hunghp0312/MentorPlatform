using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.Responses.Categories
{
    public class CategoryResponse : BaseResponse
    {
        public string? Status { get; set; }
        public int CourseCount { get; set; }
    }
}
