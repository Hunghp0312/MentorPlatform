using ApplicationCore.DTOs.Responses.DocumentContents;

namespace ApplicationCore.DTOs.Responses.SupportingDocuments
{
    public class DocumentDetailResponse : ResourceFileResponse
    {
        public required byte[] FileContent { get; set; } = Array.Empty<byte>();
    }
}
