namespace ApplicationCore.DTOs.Responses.SupportingDocuments
{
    public class SupportingDocumentResponse
    {
        public Guid FileId { get; set; }
        public required string FileName { get; set; }
    }
}