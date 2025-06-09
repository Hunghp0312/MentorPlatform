using Infrastructure.Entities.Enum;

namespace Infrastructure.Entities
{
    public class Resource
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public Guid CourseId { get; set; }
        public virtual Course? Course { get; set; }
        public int TypeOfResourceId { get; set; }
        public int ResourceCategoryId { get; set; }
        public TypeOfResource? TypeOfResource { get; set; }
        public ResourceCategory? ResourceCategory { get; set; }
        public required string Description { get; set; }
        public virtual DocumentContent? DocumentContent { get; set; }
        public Guid? DocumentContentId { get; set; }
        public string? Url { get; set; }
        public int DownloadCount { get; set; } = 0;
        public virtual ICollection<ResourceDownload> ResourceDownloads { get; set; } = new List<ResourceDownload>();
    }
}