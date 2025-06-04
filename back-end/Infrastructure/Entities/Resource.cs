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
        public required TypeOfResource TypeOfResource { get; set; }
        public required ResourceCategory ResourceCategory { get; set; }
        public string? Description { get; set; }
        public Guid? SupoprtingDocumentId { get; set; }
        public virtual SupportingDocument? SupportingDocument { get; set; }
    }
}