namespace ApplicationCore.DTOs.Responses.Resources
{
    public class UpdateResourceUrlResponse
    {
        public Guid ResourceId { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
