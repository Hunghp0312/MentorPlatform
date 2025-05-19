using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Category
{
    public class CategoryResponse : BaseResponse
    {
        public required CategoryStatus Status { get; set; }
        public int CourseCount { get; set; }
    }
}
