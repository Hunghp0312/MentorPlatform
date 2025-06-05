
namespace ApplicationCore.DTOs.Requests.Resources
{
    public class AddResourceRequest : EditResourceRequest
    {
        public Guid CourseId { get; set; }
    }
}