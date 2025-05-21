namespace Infrastructure.Entities
{
    public class SupportingDocument
    {
        public Guid Id { get; set; }
        public Guid? MentorApplicationId { get; set; }
        public virtual MentorApplication? MentorApplication { get; set; }
        public Guid? ResourceId { get; set; }
        public virtual Resource? Resource { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public virtual DocumentContent? DocumentContent { get; set; }
    }
}
