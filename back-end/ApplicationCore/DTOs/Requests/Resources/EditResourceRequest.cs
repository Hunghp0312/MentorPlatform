namespace ApplicationCore.DTOs.Requests.Resources
{
    public class EditResourceRequest
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public int ResourceCategoryId { get; set; }
        public int TypeOfResourceId { get; set; }
        public string? Url { get; set; }
    }
}