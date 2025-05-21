namespace ApplicationCore.DTOs.Requests.Categories
{
    public class CategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int StatusId { get; set; }
    }
}
