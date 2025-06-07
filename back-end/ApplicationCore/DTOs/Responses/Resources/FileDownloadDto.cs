namespace ApplicationCore.DTOs.Responses.Resources
{
    public class FileDownloadDto
    {
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public required string ContentType { get; set; }
        public required string FileName { get; set; }
    }
}
