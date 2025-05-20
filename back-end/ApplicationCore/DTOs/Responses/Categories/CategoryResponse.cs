using ApplicationCore.DTOs.Common;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Categories
{
    public class CategoryResponse : BaseResponse
    {
        public CategoryStatus? Status { get; set; }
        public int CourseCount { get; set; }
    }
}
