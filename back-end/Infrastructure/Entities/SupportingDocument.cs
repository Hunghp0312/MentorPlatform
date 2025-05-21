namespace Infrastructure.Entities
{
    public class SupportingDocument
    {
        public Guid Id { get; set; }
        public Guid MentorApplicationId { get; set; }
        public virtual MentorApplication MentorApplication { get; set; } = null!;
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
