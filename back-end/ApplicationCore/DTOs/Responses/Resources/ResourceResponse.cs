using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Resources
{
    public class ResourceResponse
    {
        public Guid ResourceId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required TypeOfResource TypeOfResource { get; set; }
        public required ResourceCategory ResourceCategory { get; set; }
        public required Guid CourseId { get; set; }
        public required string CourseName { get; set; }
    }
}