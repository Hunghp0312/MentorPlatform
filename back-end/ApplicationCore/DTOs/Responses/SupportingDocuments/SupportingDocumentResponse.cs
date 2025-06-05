namespace ApplicationCore.DTOs.Responses.SupportingDocuments
{
    public class SupportingDocumentResponse
    {
        public Guid FileId { get; set; }
        public required string FileName { get; set; }
        public string FileContent { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
    }
}