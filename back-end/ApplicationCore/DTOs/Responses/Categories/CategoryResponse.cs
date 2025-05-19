using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.Category
{
    public class CategoryResponse : BaseResponse
    {
        public CategoryStatus Status { get; set; }//quang sửa đi
        public int CourseCount { get; set; }
    }
}
