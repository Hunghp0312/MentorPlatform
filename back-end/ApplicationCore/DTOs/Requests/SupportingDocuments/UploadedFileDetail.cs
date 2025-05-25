namespace ApplicationCore.DTOs.Requests.SupportingDocuments
{
    public class UploadedFileDetail
    {
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long Length { get; set; }
        public Stream ContentStream { get; set; } = Stream.Null;
    }
}
