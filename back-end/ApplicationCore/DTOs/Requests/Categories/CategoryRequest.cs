namespace ApplicationCore.DTOs.Requests.Categories
{
    public class CategoryRequest
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public int StatusId { get; set; }
    }
}
