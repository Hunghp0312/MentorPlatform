using ApplicationCore.Common;

namespace ApplicationCore.DTOs.Category
{
    public class UpdateCategoryRequest
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public CategoryStatus Status { get; set; }
    }
}
