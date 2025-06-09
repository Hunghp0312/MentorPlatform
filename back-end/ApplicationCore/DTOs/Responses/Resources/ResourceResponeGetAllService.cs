namespace ApplicationCore.DTOs.Responses.Resources
{
    public class ResourceResponeGetAllService : ResourceResponse
    {
        public Guid? FileId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
    }
}