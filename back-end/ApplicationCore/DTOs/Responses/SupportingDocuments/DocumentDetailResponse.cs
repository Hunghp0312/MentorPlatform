namespace ApplicationCore.DTOs.Responses.SupportingDocuments
{
    public class DocumentDetailResponse
    {
        public required Guid Id { get; set; }
        public required string FileName { get; set; }
        public required string FileType { get; set; } = string.Empty;
        public required byte[] FileContent { get; set; } = Array.Empty<byte>();
    }
}
