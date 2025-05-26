namespace Infrastructure.Entities
{
    public class SupportingDocument
    {
        public Guid Id { get; set; }
        public Guid? MentorApplicationId { get; set; }
        public virtual MentorApplication? MentorApplication { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public Guid DocumentContentId { get; set; }
        public virtual DocumentContent DocumentContent { get; set; } = default!;
    }
}
