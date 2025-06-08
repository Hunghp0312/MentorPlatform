namespace ApplicationCore.DTOs.Responses.DocumentContents
{
    public class ResourceFileResponse
    {
        public Guid FileId { get; set; }
        public required string FileName { get; set; }
        public string FileType { get; set; } = string.Empty;
    }
}
