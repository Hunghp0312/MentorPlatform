namespace Infrastructure.Entities
{
    public class Resource
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public Guid? CourseId { get; set; }
        public int? Type { get; set; }
        public Guid? ResourceCategoryId { get; set; }
        public string? Description { get; set; }
        public virtual Course? Course { get; set; }
        public Guid? DocumentContentId { get; set; }
        public virtual DocumentContent? DocumentContent { get; set; }
    }
}