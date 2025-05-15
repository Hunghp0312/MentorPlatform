namespace ApplicationCore.DTOs.Category
{
    public class UpdateCategoryRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public CategoryStatus Status { get; set; }
    }
}
