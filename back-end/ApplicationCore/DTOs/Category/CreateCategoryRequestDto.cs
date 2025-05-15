namespace ApplicationCore.DTOs.Category
{
    public class CreateCategoryRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public CategoryStatus Status { get; set; }
    }
}
