namespace Infrastructure.Entities
{
    public class ResourceDownload
    {
        public Guid Id { get; set; }
        public Guid? ResourceId { get; set; }
        public Guid? DocumentContentId { get; set; }
        public long FileSize { get; set; }
        public virtual Resource? Resource { get; set; }
        public virtual DocumentContent? DocumentContent { get; set; }
    }
}