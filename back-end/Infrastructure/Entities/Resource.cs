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
        public Guid? SupoprtingDocumentId { get; set; }
        public virtual SupportingDocument? SupportingDocument { get; set; }
    }
}